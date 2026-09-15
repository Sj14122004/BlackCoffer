import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getIntensityBySector } from "../../api/dataApi";

const IntensityBySector = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

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
          "Failed to fetch intensity by sector:",
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

    const width = 900;
    const height = Math.max(
      400,
      data.length * 55
    );

    const margin = {
      top: 30,
      right: 70,
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
      .domain(data.map((item) => item._id))
      .range([0, chartHeight])
      .padding(0.25);

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

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "16px");

    chart
      .append("g")
      .attr(
        "transform",
        `translate(0,${chartHeight})`
      )
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "14px");

    chart
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Average Intensity");

    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (item) => y(item._id))
      .attr(
        "width",
        (item) =>
          x(item.averageIntensity)
      )
      .attr("height", y.bandwidth())
      .attr("fill", "#0d6efd");

    chart
      .selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr(
        "x",
        (item) =>
          x(item.averageIntensity) + 8
      )
      .attr(
        "y",
        (item) =>
          y(item._id) +
          y.bandwidth() / 2
      )
      .attr("dy", "0.35em")
      .style("font-size", "15px")
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
          No sector data available for the selected filters.
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

export default IntensityBySector;