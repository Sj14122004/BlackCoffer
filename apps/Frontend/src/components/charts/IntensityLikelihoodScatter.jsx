import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getData } from "../../api/dataApi";

const IntensityLikelihoodScatter = ({
  filters,
  search,
}) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

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
          "Failed to fetch intensity likelihood data:",
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

    const width = 1100;
    const height = 430;

    const margin = {
      top: 30,
      right: 60,
      bottom: 75,
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
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "16px");

    chart
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Intensity");

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
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Likelihood");

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "fixed")
      .style("background", "white")
      .style("border", "1px solid #dee2e6")
      .style("border-radius", "6px")
      .style("padding", "10px 12px")
      .style("font-size", "14px")
      .style(
        "box-shadow",
        "0 4px 12px rgba(0,0,0,0.15)"
      )
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 1000);

    chart
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr(
        "cx",
        (item) => x(item.intensity)
      )
      .attr(
        "cy",
        (item) => y(item.likelihood)
      )
      .attr("r", 7)
      .attr("fill", "#0d6efd")
      .style("cursor", "pointer")
      .on(
        "mouseover",
        function (event, item) {
          d3.select(this).attr("r", 9);

          tooltip
            .style("opacity", 1)
            .html(`
              <div class="fw-bold mb-1">
                ${item.title || "Insight"}
              </div>

              <div>
                <strong>Country:</strong>
                ${item.country || "-"}
              </div>

              <div>
                <strong>Topic:</strong>
                ${item.topic || "-"}
              </div>

              <div>
                <strong>Intensity:</strong>
                ${item.intensity}
              </div>

              <div>
                <strong>Likelihood:</strong>
                ${item.likelihood}
              </div>

              <div>
                <strong>Relevance:</strong>
                ${item.relevance ?? "-"}
              </div>
            `);
        }
      )
      .on(
        "mousemove",
        function (event) {
          tooltip
            .style(
              "left",
              `${event.clientX + 15}px`
            )
            .style(
              "top",
              `${event.clientY + 15}px`
            );
        }
      )
      .on(
        "mouseout",
        function () {
          d3.select(this).attr("r", 7);
          tooltip.style("opacity", 0);
        }
      );

    return () => {
      tooltip.remove();
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <p className="text-secondary mb-0">
          No intensity and likelihood data available for the selected filters.
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

export default IntensityLikelihoodScatter;