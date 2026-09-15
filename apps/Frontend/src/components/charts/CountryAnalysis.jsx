import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getCountryAnalysis } from "../../api/dataApi";

const CountryAnalysis = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const result = await getCountryAnalysis({
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
          "Failed to fetch country analysis:",
          error
        );
        setData([]);
      }
    };

    fetchCountryData();
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
      .domain(data.map((item) => item._id))
      .range([0, chartHeight])
      .padding(0.3);

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

    // Warm intensity color scale - orange to red
    const colorScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.averageIntensity
        ) || 1,
      ])
      .range(["#f97316", "#dc2626"]);

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
      .text("Average Intensity");

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
      .attr("fill", (item) => colorScale(item.averageIntensity))
      .attr("rx", 4)
      .attr("width", 0)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("mouseenter", function (event, item) {
        setHoveredCountry(item._id);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.85)
          .attr("filter", "drop-shadow(0 4px 8px rgba(220, 38, 38, 0.25))");
      })
      .on("mouseleave", function () {
        setHoveredCountry(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("filter", "none");
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .attr("width", (item) =>
        x(item.averageIntensity)
      );

    // Value labels with better formatting
    chart
      .selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr(
        "x",
        (item) =>
          x(item.averageIntensity) + 12
      )
      .attr(
        "y",
        (item) =>
          y(item._id) +
          y.bandwidth() / 2
      )
      .attr("dy", "0.35em")
      .style("font-size", "15px")
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
      .delay((_, i) => i * 50 + 400)
      .style("opacity", 1);

  }, [data]);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No country data available for the selected filters.
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

export default CountryAnalysis;