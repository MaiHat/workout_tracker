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
  const { monthlyStats } = useWorkouts();

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
    <div style={{ width: "100%", height: 450, textAlign: "center" }}>
    {/* ALL */}
    <div style={{ marginBottom: "1rem"}} >
      <button onClick={() => {
        setSelectedType("all");
        setSelectedKey("");
       }}
        style={{ fontWeight: selectedType === "all" ? "bold" : "normal"}}
      >
        ALL
      </button>
    </div>

    {/* bodyPart */}
      <p><strong>By Body Part/</strong></p>
        <div style={{ marginBottom: "1rem" }}>
          {bodyPartKeys.map((bp) => (
            <button
              key={bp}
              onClick={() => {
                setSelectedType("bodyPart");
                setSelectedKey(bp)
              }}
              style={{
                margin: "0 5px",
                fontWeight: selectedType === "bodyPart" && selectedKey === bp 
                ? "bold" : "normal",
              }}
            >
              {bp}
            </button>
          ))}
        </div>

      {/* workoutName */}
      <p><strong>By Workout Name/</strong></p>
      <div style={{ marginBottom: "1rem" }}>
        {workoutNameKeys.map((wn) => (
          <button
          key={wn}
          onClick={() => {
            setSelectedType("workoutName");
            setSelectedKey(wn)
          }}
          style={{
            margin: "0 5px",
            fontWeight: selectedType === "workoutName" && selectedKey === wn
            ? "bold" : "normal",
          }}
          >
            {wn}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
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
            dataKey="maxWeight"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Max Weight (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
