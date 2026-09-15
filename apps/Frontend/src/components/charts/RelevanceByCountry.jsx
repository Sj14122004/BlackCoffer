import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getRelevanceByCountry } from "../../api/dataApi";

const RelevanceByCountry = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRelevanceData = async () => {
      try {
        const result = await getRelevanceByCountry({
          ...filters,
          search,
        });

        const formattedData = result
          .filter((item) => item._id)
          .sort(
            (a, b) =>
              b.averageRelevance -
              a.averageRelevance
          )
          .slice(0, 10);

        setData(formattedData);
      } catch (error) {
        console.error(
          "Failed to fetch relevance by country:",
          error
        );

        setData([]);
      }
    };

    fetchRelevanceData();
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
      .domain(data.map((item) => item._id))
      .range([0, chartHeight])
      .padding(0.25);

    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.averageRelevance
        ) || 1,
      ])
      .nice()
      .range([0, chartWidth]);

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "18px");

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
      .text("Average Relevance");

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
          x(item.averageRelevance)
      )
      .attr("height", y.bandwidth())
      .attr("fill", "#198754");

    chart
      .selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr(
        "x",
        (item) =>
          x(item.averageRelevance) + 10
      )
      .attr(
        "y",
        (item) =>
          y(item._id) +
          y.bandwidth() / 2
      )
      .attr("dy", "0.35em")
      .style("font-size", "18px")
      .text((item) =>
        Number(
          item.averageRelevance
        ).toFixed(2)
      );
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No relevance data available for the selected filters.
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

export default RelevanceByCountry;