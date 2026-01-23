import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useWorkouts } from "../contexts/workoutsContext";

export const LineGraph = () => {
  const { monthlyStats, currentMonth, monthsOfYear, currentYear } = useWorkouts();

  const [selectedType, setSelectedType] = useState("all"); 
  const [selectedKey, setSelectedKey] = useState("");

  // bodyPart / workoutName のキー一覧
  const bodyPartKeys = Object.keys(monthlyStats?.byBodyPart || {});
  const workoutNameKeys = Object.keys(monthlyStats?.byWorkoutName || {});

  // chart dataの選択
  let chartData = [];
  if (selectedType === "all") {
    chartData = monthlyStats?.all || [];
  } else if (selectedType === "bodyPart") {
    chartData = monthlyStats?.byBodyPart?.[selectedKey] || [];
  } else if (selectedType === "workoutName") {
    chartData = monthlyStats?.byWorkoutName?.[selectedKey] || [];
  }
  
  return (
    <div className="line-graph">
      <div className="line-graph--header">
        Improvement of {monthsOfYear[currentMonth]} {currentYear}
      </div>
      {/* ALL */}
      <div className="switching-btn--wrapper">
       <div className='switching-btn--all'>
          <button onClick={() => {
              setSelectedType("all"); 
              setSelectedKey("");
            }}
            className={selectedType === "all" ? "btn--primary" : "btn--light"}
            >
          ALL
          </button>
        </div>
        {/* bodyPart */}
        <div className="switching-btn--bp">
          <h4>By Body Part/ </h4>
          <div>
            {bodyPartKeys.map((bp) => (
              <button
                key={bp}
                onClick={() => {
                  setSelectedType("bodyPart");
                  setSelectedKey(bp)
                }}
                className={selectedType === "bodyPart" && selectedKey === bp 
                  ? "btn--primary" : "btn--light"}>
                {bp}
              </button>
            ))}
          </div>
        </div>
        {/* workoutName */}
        <div className="switching-btn--wn">
          <h4>By Workout Name/ </h4>
            {workoutNameKeys.map((wn) => (
              <button
                key={wn}
                onClick={() => {
                  setSelectedType("workoutName");
                  setSelectedKey(wn)
                }}
                className={selectedType === "workoutName" && selectedKey === wn
                  ? "btn--primary" : "btn--light"
                }>
                {wn}
              </button>
            ))}
        </div>
      </div>

      <div className="line-graph--scroll">
        <div className="line-graph--inner" style={{ width: chartData.length * 60 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 17 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="maxRM"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Max RM"
              />
              <Line
                type="monotone"
                dataKey="maxWeightKg"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Max Weight (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
