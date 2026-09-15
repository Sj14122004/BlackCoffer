import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getIntensityByYear } from "../../api/dataApi";

const IntensityByYear = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

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

    const width = 1100;
    const height = 430;

    const margin = {
      top: 30,
      right: 70,
      bottom: 90,
      left: 80,
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

    const yearStep = Math.ceil(
      data.length / 8
    );

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

    chart
      .append("g")
      .attr(
        "transform",
        `translate(0,${chartHeight})`
      )
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "16px")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "16px");

    chart
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 80)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Year");

    chart
      .append("text")
      .attr(
        "transform",
        "rotate(-90)"
      )
      .attr(
        "x",
        -chartHeight / 2
      )
      .attr("y", -55)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Average Intensity");

    const line = d3
      .line()
      .x((item) => x(item.year))
      .y((item) =>
        y(item.averageIntensity)
      );

    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#0d6efd")
      .attr("stroke-width", 4)
      .attr("d", line);

    chart
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr(
        "cx",
        (item) => x(item.year)
      )
      .attr(
        "cy",
        (item) =>
          y(item.averageIntensity)
      )
      .attr("r", 7)
      .attr("fill", "#0d6efd");

    const labelStep = Math.ceil(
      data.length / 8
    );

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
      .attr(
        "x",
        (item) => x(item.year)
      )
      .attr(
        "y",
        (item) =>
          y(item.averageIntensity) - 12
      )
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text((item) =>
        Number(
          item.averageIntensity
        ).toFixed(2)
      );
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No year data available for the selected filters.
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

export default IntensityByYear;