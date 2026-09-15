import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getData } from "../../api/dataApi";

const RegionAnalysis = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRegionData = async () => {
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

        const regionCounts = d3
          .rollups(
            records.filter((item) => item.region),
            (items) => items.length,
            (item) => item.region
          )
          .map(([region, count]) => ({
            region,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setData(regionCounts);
      } catch (error) {
        console.error(
          "Failed to fetch region analysis:",
          error
        );

        setData([]);
      }
    };

    fetchRegionData();
  }, [filters, search]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) {
      return;
    }

    const width = 1100;
    const height = Math.max(400, data.length * 55);

    const margin = {
      top: 30,
      right: 80,
      bottom: 60,
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
      .domain(data.map((item) => item.region))
      .range([0, chartHeight])
      .padding(0.25);

    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max((data), (item) => item.count) || 1,
      ])
      .nice()
      .range([0, chartWidth]);

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "17px");

    chart
      .append("g")
      .attr(
        "transform",
        `translate(0,${chartHeight})`
      )
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "16px");

    chart
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Records");

    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (item) => y(item.region))
      .attr(
        "width",
        (item) => x(item.count)
      )
      .attr("height", y.bandwidth())
      .attr("fill", "#6f42c1");

    chart
      .selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr(
        "x",
        (item) => x(item.count) + 10
      )
      .attr(
        "y",
        (item) =>
          y(item.region) +
          y.bandwidth() / 2
      )
      .attr("dy", "0.35em")
      .style("font-size", "17px")
      .text((item) => item.count);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No region data available for the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-100 overflow-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default RegionAnalysis;