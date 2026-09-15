import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getData } from "../../api/dataApi";

const CityAnalysis = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [hoveredCity, setHoveredCity] = useState(null);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const result = await getData({
          ...filters,
          search,
          page: 1,
          limit: 1000,
        });

        const records = Array.isArray(result)
          ? result
          : result.data || [];

        const cityCounts = d3
          .rollups(
            records.filter((item) => item.city),
            (items) => items.length,
            (item) => item.city
          )
          .map(([city, count]) => ({
            city,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setData(cityCounts);
      } catch (error) {
        console.error(
          "Failed to fetch city analysis:",
          error
        );
        setData([]);
      }
    };

    fetchCityData();
  }, [filters, search]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) {
      return;
    }

    const width = 1100;
    const height = Math.max(400, data.length * 55);

    const margin = {
      top: 40,
      right: 100,
      bottom: 70,
      left: 180,
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

    const y = d3
      .scaleBand()
      .domain(data.map((item) => item.city))
      .range([0, chartHeight])
      .padding(0.3);

    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (item) => item.count) || 1,
      ])
      .nice()
      .range([0, chartWidth]);

    // Color scale - modern vibrant gradient
    const colorScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (item) => item.count) || 1,
      ])
      .range(["#3b82f6", "#1e40af"]);

    // Grid lines for better readability
    chart
      .append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
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
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "15px")
      .style("font-weight", "500")
      .style("fill", "var(--text-primary, #1f2937)");

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
      .style("font-size", "14px")
      .style("fill", "var(--text-secondary, #6b7280)");

    xAxisGroup.selectAll(".domain").remove();

    // X-axis label
    chart
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 55)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("font-weight", "500")
      .style("fill", "var(--text-primary, #1f2937)")
      .text("Number of Records");

    // Bars with animation
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (item) => y(item.city))
      .attr("height", y.bandwidth())
      .attr("fill", (item) => colorScale(item.count))
      .attr("rx", 4)
      .attr("width", 0)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("mouseenter", function (event, item) {
        setHoveredCity(item.city);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.8)
          .attr("filter", "drop-shadow(0 4px 6px rgba(59, 130, 246, 0.2))");
      })
      .on("mouseleave", function () {
        setHoveredCity(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("filter", "none");
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .attr("width", (item) => x(item.count));

    // Value labels
    chart
      .selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", (item) => x(item.count) + 12)
      .attr(
        "y",
        (item) =>
          y(item.city) + y.bandwidth() / 2
      )
      .attr("dy", "0.35em")
      .style("font-size", "15px")
      .style("font-weight", "600")
      .style("fill", "var(--text-primary, #1f2937)")
      .style("opacity", 0)
      .text((item) => item.count)
      .transition()
      .duration(800)
      .delay((_, i) => i * 50 + 400)
      .style("opacity", 1);

  }, [data]);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No city data available for the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-100 overflow-auto"
      style={{
        padding: "20px 0",
        background: "var(--surface-2, #ffffff)",
        borderRadius: "12px",
      }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CityAnalysis;