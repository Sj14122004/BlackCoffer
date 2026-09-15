import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getData } from "../../api/dataApi";

const IntensityLikelihoodScatter = ({
  filters,
  search,
}) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const fetchScatterData = async () => {
      try {
        const result = await getData({
          ...filters,
          search,
        });

        const records = Array.isArray(result)
          ? result
          : result.data || [];

        const formattedData = records.filter(
          (item) =>
            typeof item.intensity === "number" &&
            typeof item.likelihood === "number"
        );

        setData(formattedData);
      } catch (error) {
        console.error(
          "Failed to fetch scatter data:",
          error
        );
        setData([]);
      }
    };

    fetchScatterData();
  }, [filters, search]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) {
      return;
    }

    const isMobile = containerWidth < 480;
    const isTablet = containerWidth < 768;

    const width = containerWidth - 20;
    const height = isMobile ? 350 : isTablet ? 400 : 450;

    const margin = {
      top: isMobile ? 20 : isTablet ? 30 : 40,
      right: isMobile ? 20 : isTablet ? 30 : 40,
      bottom: isMobile ? 50 : isTablet ? 70 : 80,
      left: isMobile ? 60 : isTablet ? 70 : 80,
    };

    d3.select(svgRef.current)
      .selectAll("*")
      .remove();

    const svg = d3
      .select(svgRef.current)
      .attr(
        "viewBox",
        `0 0 ${width} ${height}`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .attr("height", height);

    const chartWidth =
      width - margin.left - margin.right;

    const chartHeight =
      height - margin.top - margin.bottom;

    const chart = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top})`
      );

    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.intensity
        ) || 1,
      ])
      .nice()
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.likelihood
        ) || 1,
      ])
      .nice()
      .range([chartHeight, 0]);

    // Color scale for intensity
    const colorScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.intensity
        ) || 1,
      ])
      .range(["#c4b5fd", "#7c3aed"]);

    // Grid lines
    chart
      .append("g")
      .attr("class", "grid")
      .attr("opacity", 0.08)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-chartWidth)
          .tickFormat("")
      )
      .selectAll(".domain")
      .remove();

    // X-axis
    const xAxisGroup = chart
      .append("g")
      .attr(
        "transform",
        `translate(0,${chartHeight})`
      )
      .call(d3.axisBottom(x))
      .attr("class", "x-axis");

    xAxisGroup
      .selectAll("text")
      .style("font-size", isMobile ? "25px" : "25px")
      .style("fill", "var(--text-secondary, #6b7280)");

    xAxisGroup.selectAll(".domain").remove();

    // Y-axis
    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", isMobile ? "25px" : "25px")
      .style("fill", "var(--text-secondary, #6b7280)");

    chart.selectAll(".y-axis .domain").remove();

    // X-axis label
    if (!isMobile) {
      chart
        .append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 70)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("font-weight", "500")
        .style("fill", "var(--text-primary, #1f2937)")
        .text("Intensity");
    }

    // Y-axis label
    if (!isMobile) {
      chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("font-weight", "500")
        .style("fill", "var(--text-primary, #1f2937)")
        .text("Likelihood");
    }

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "fixed")
      .style("background", "var(--surface-2, white)")
      .style("border", "1px solid var(--border, #e5e7eb)")
      .style("border-radius", "8px")
      .style("padding", "12px 14px")
      .style("font-size", "25px")
      .style(
        "box-shadow",
        "0 4px 12px rgba(0,0,0,0.1)"
      )
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 1000)
      .style("max-width", "250px");

    // Points
    chart
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (item) => x(item.intensity))
      .attr("cy", (item) => y(item.likelihood))
      .attr("r", isMobile ? 4 : 6)
      .attr("fill", (item) =>
        colorScale(item.intensity)
      )
      .attr("opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseover", function (event, item) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", isMobile ? 7 : 10)
          .attr("opacity", 1)
          .attr(
            "filter",
            "drop-shadow(0 4px 12px rgba(124, 58, 237, 0.35))"
          );

        tooltip
          .style("opacity", 1)
          .html(`
            <div style="font-weight: 600; color: #7c3aed; margin-bottom: 8px;">
              ${item.title || "Insight"}
            </div>
            ${
              item.country
                ? `<div><strong>Country:</strong> ${item.country}</div>`
                : ""
            }
            ${
              item.topic
                ? `<div><strong>Topic:</strong> ${item.topic}</div>`
                : ""
            }
            <div><strong>Intensity:</strong> ${item.intensity}</div>
            <div><strong>Likelihood:</strong> ${item.likelihood}</div>
            ${
              item.relevance !== undefined
                ? `<div><strong>Relevance:</strong> ${item.relevance}</div>`
                : ""
            }
          `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style(
            "left",
            `${Math.min(event.clientX + 12, window.innerWidth - 280)}px`
          )
          .style(
            "top",
            `${Math.min(event.clientY + 12, window.innerHeight - 200)}px`
          );
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", isMobile ? 4 : 6)
          .attr("opacity", 0.7)
          .attr("filter", "none");

        tooltip.style("opacity", 0);
      })
      .style("opacity", 0)
      .transition()
      .duration(800)
      .ease(d3.easeQuadInOut)
      .delay((_, i) => i * 30)
      .style("opacity", 0.7);

    return () => {
      tooltip.remove();
    };
  }, [data, containerWidth]);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        setContainerWidth(
          svgRef.current.parentElement.clientWidth
        );
      }
    };

    const resizeObserver = new ResizeObserver(
      handleResize
    );
    if (svgRef.current?.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No scatter data available
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "var(--surface-2, #ffffff)",
        borderRadius: "12px",
        border: "1px solid var(--border, #e5e7eb)",
        minHeight: "400px",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "600",
          color: "var(--text-primary, #1f2937)",
        }}
      >
        Intensity vs Likelihood
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntensityLikelihoodScatter;