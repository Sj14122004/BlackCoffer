import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getLikelihoodByTopic } from "../../api/dataApi";

const LikelihoodByTopic = ({ filters, search }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const result = await getLikelihoodByTopic({
          ...filters,
          search,
        });

        const formattedData = result
          .filter((item) => item._id)
          .sort(
            (a, b) =>
              b.averageLikelihood -
              a.averageLikelihood
          )
          .slice(0, 10);

        setData(formattedData);
      } catch (error) {
        console.error(
          "Failed to fetch likelihood by topic:",
          error
        );

        setData([]);
      }
    };

    fetchTopicData();
  }, [filters, search]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) {
      return;
    }

    const width = 900;
    const height = 450;

    const margin = {
      top: 30,
      right: 40,
      bottom: 100,
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
      .scaleBand()
      .domain(data.map((item) => item._id))
      .range([0, chartWidth])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data,
          (item) => item.averageLikelihood
        ) || 1,
      ])
      .nice()
      .range([chartHeight, 0]);

    chart
      .append("g")
      .attr(
        "transform",
        `translate(0,${chartHeight})`
      )
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "14px")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "14px");

    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (item) => x(item._id))
      .attr(
        "y",
        (item) =>
          y(item.averageLikelihood)
      )
      .attr("width", x.bandwidth())
      .attr(
        "height",
        (item) =>
          chartHeight -
          y(item.averageLikelihood)
      )
      .attr("fill", "#0d6efd");

    chart
      .selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr(
        "x",
        (item) =>
          x(item._id) +
          x.bandwidth() / 2
      )
      .attr(
        "y",
        (item) =>
          y(item.averageLikelihood) - 8
      )
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text((item) =>
        Number(
          item.averageLikelihood
        ).toFixed(2)
      );
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No topic data available for the selected filters.
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

export default LikelihoodByTopic;