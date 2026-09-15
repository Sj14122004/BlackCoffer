import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getIntensityBySector } from "../../api/dataApi";

const IntensityBySector = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const result = await getIntensityBySector({
          ...filters,
          search,
        });

        const formattedData = result
          .filter((item) => item._id)
          .sort(
            (a, b) =>
              b.averageIntensity -
              a.averageIntensity
          )
          .slice(0, 10);

        setData(formattedData);
      } catch (error) {
        console.error(
          "Failed to fetch sector data:",
          error
        );
        setData([]);
      }
    };

    fetchSectorData();
  }, [filters, search]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) {
      return;
    }

    const isMobile = containerWidth < 480;
    const isTablet = containerWidth < 768;

    const width = containerWidth - 20;
    const height = Math.max(400, Math.min(data.length * 48, 600));

    const margin = {
    top: isMobile ? 20 : isTablet ? 30 : 40,
    right: isMobile ? 20 : isTablet ? 30 : 40,
    bottom: isMobile ? 40 : isTablet ? 50 : 60,
    left: isMobile ? 160 : isTablet ? 210 : 250,
    };

    d3.select(svgRef.current)
      .selectAll("*")
      .remove();

    const svg = d3
    .select(svgRef.current)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", height)
    .style("overflow", "visible");

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

    const y = d3
      .scaleBand()
      .domain(data.map((item) => item._id))
      .range([0, chartHeight])
      .padding(isMobile ? 0.35 : 0.3);

    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.averageIntensity
        ) || 1,
      ])
      .nice()
      .range([0, chartWidth]);

    const colorScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.averageIntensity
        ) || 1,
      ])
      .range(["#fcd34d", "#f59e0b"]);

    // Grid lines
    chart
      .append("g")
      .attr("class", "grid")
      .attr("opacity", 0.08)
      .call(
        d3
          .axisBottom(x)
          .tickSize(chartHeight)
          .tickFormat("")
      )
      .selectAll(".domain")
      .remove();

    // Y-axis
    chart
      .append("g")
        .attr("class", "y-axis")
        .call(
        d3.axisLeft(y)
            .tickPadding(12)
        )
        .selectAll("text")
        .style("font-size", "24px")
        .style("font-weight", "600")
        .style("fill", "var(--text-primary, #1f2937)")
        .each(function (d) {
        if (isMobile && d.length > 10) {
            d3.select(this).text(d.substring(0, 8) + "...");
        }
        });

    chart
      .selectAll(".y-axis .domain")
      .remove();

    chart
      .selectAll(".y-axis .tick line")
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
      .style("font-size", isMobile ? "24px" : "24px")
      .style("fill", "var(--text-secondary, #6b7280)");

    xAxisGroup.selectAll(".domain").remove();

    // X-axis label
    if (!isMobile) {
      chart
        .append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "29px")
        .style("font-weight", "500")
        .style("fill", "var(--text-primary, #1f2937)")
        .text("Average Intensity");
    }

    // Bars with animation
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (item) => y(item._id))
      .attr("height", y.bandwidth())
      .attr("fill", (item) =>
        colorScale(item.averageIntensity)
      )
      .attr("rx", 4)
      .attr("width", 0)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, item) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.85)
          .attr(
            "filter",
            "drop-shadow(0 4px 12px rgba(245, 158, 11, 0.25))"
          );
      })
      .on("mouseleave", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("filter", "none");
      })
      .transition()
      .duration(800)
      .ease(d3.easeQuadInOut)
      .delay((_, i) => i * (isMobile ? 30 : 50))
      .attr("width", (item) =>
        x(item.averageIntensity)
      );

    // Value labels
    if (!isMobile) {
      chart
        .selectAll(".value")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "value")
        .attr(
          "x",
          (item) =>
            x(item.averageIntensity) + 10
        )
        .attr(
          "y",
          (item) =>
            y(item._id) +
            y.bandwidth() / 2
        )
        .attr("dy", "0.35em")
        .style("font-size", "24px")
        .style("font-weight", "600")
        .style("fill", "var(--text-primary, #1f2937)")
        .style("opacity", 0)
        .text((item) =>
          Number(
            item.averageIntensity
          ).toFixed(2)
        )
        .transition()
        .duration(800)
        .ease(d3.easeQuadInOut)
        .delay((_, i) => i * 50 + 400)
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
          No sector data available
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
          fontSize: "24px",
          fontWeight: "600",
          color: "var(--text-primary, #1f2937)",
        }}
      >
        Likelihood by Topic chart
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntensityBySector;