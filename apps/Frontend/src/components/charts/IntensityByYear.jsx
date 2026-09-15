import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getIntensityByYear } from "../../api/dataApi";

const IntensityByYear = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const result = await getIntensityByYear({
          ...filters,
          search,
        });

        const formattedData = result
          .filter(
            (item) =>
              item._id &&
              !Number.isNaN(Number(item._id)) &&
              typeof item.averageIntensity === "number"
          )
          .map((item) => ({
            year: Number(item._id),
            averageIntensity:
              item.averageIntensity,
          }))
          .sort((a, b) => a.year - b.year);

        setData(formattedData);
      } catch (error) {
        console.error(
          "Failed to fetch intensity by year:",
          error
        );
        setData([]);
      }
    };

    fetchYearData();
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
      .scalePoint()
      .domain(data.map((item) => item.year))
      .range([0, chartWidth])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.averageIntensity
        ) || 1,
      ])
      .nice()
      .range([chartHeight, 0]);

    const yearStep = Math.max(1, Math.ceil(data.length / 6));

    const visibleYears = data
      .filter(
        (_, index) =>
          index % yearStep === 0 ||
          index === data.length - 1
      )
      .map((item) => item.year);

    const xAxis = d3
      .axisBottom(x)
      .tickValues(visibleYears)
      .tickFormat(d3.format("d"));

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
      .call(xAxis)
      .attr("class", "x-axis");

    xAxisGroup
      .selectAll("text")
      .style("font-size", isMobile ? "25px" : "25px")
      .attr("transform", isMobile ? "rotate(-45)" : "rotate(-30)")
      .style("text-anchor", "end")
      .style("fill", "var(--text-secondary, #6b7280)");

    xAxisGroup.selectAll(".domain").remove();

    // Y-axis
    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", isMobile ? "23px" : "23px")
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
        .text("Year");
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
        .text("Average Intensity");
    }

    const line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((item) => x(item.year))
      .y((item) =>
        y(item.averageIntensity)
      );

    // Line path
    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#14b8a6")
      .attr("stroke-width", isMobile ? 2 : 3)
      .attr("d", line)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .ease(d3.easeQuadInOut)
      .style("opacity", 1);

    // Points
    chart
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (item) => x(item.year))
      .attr("cy", (item) =>
        y(item.averageIntensity)
      )
      .attr("r", isMobile ? 4 : 5)
      .attr("fill", "#0d9488")
      .style("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", isMobile ? 6 : 8)
          .attr("filter", "drop-shadow(0 2px 8px rgba(13, 148, 136, 0.3))");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", isMobile ? 4 : 5)
          .attr("filter", "none");
      })
      .transition()
      .duration(1000)
      .ease(d3.easeQuadInOut)
      .delay((_, i) => i * 50)
      .style("opacity", 1);

    // Value labels
    if (!isMobile) {
      const labelStep = Math.max(1, Math.ceil(data.length / 6));

      chart
        .selectAll(".value")
        .data(
          data.filter(
            (_, index) =>
              index % labelStep === 0 ||
              index === data.length - 1
          )
        )
        .enter()
        .append("text")
        .attr("x", (item) => x(item.year))
        .attr(
          "y",
          (item) =>
            y(item.averageIntensity) - 15
        )
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("font-weight", "700")
        .style("fill", "#0d9488")
        .style("opacity", 0)
        .text((item) =>
          Number(
            item.averageIntensity
          ).toFixed(2)
        )
        .transition()
        .duration(1000)
        .ease(d3.easeQuadInOut)
        .delay((_, i) => i * 100 + 500)
        .style("opacity", 1);
    }
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
          No year data available
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
        Intensity by Year
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntensityByYear;