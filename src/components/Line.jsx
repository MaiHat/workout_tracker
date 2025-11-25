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

  const [viewMode, setViewMode] = useState("all"); 
  const [selectedKey, setSelectedKey] = useState("");

  // bodyPart / workoutName のキー一覧
  const bodyPartKeys = Object.keys(monthlyStats?.byBodyPart || {});
  const workoutNameKeys = Object.keys(monthlyStats?.byWorkoutName || {});

  // viewMode が切り替わったら最初のキーを自動セット
  useEffect(() => {
    if (viewMode === "bodyPart") {
      setSelectedKey(bodyPartKeys[0] || "");
    } else if (viewMode === "workoutName") {
      setSelectedKey(workoutNameKeys[0] || "");
    } else {
      setSelectedKey("");
    }
  }, [viewMode, bodyPartKeys, workoutNameKeys]);

  // chartData の選択
  let chartData = [];
  if (viewMode === "all") {
    chartData = monthlyStats?.all || [];
  } else if (viewMode === "bodyPart") {
    chartData = selectedKey
      ? monthlyStats?.byBodyPart?.[selectedKey] || []
      : [];
  } else if (viewMode === "workoutName") {
    chartData = selectedKey
      ? monthlyStats?.byWorkoutName?.[selectedKey] || []
      : [];
  }

  // 表示するキー（選択ボタン用）
  const keys =
    viewMode === "bodyPart"
      ? bodyPartKeys
      : viewMode === "workoutName"
      ? workoutNameKeys
      : [];

  // データがない場合
  if (!chartData.length) {
    return (
      <div style={{ textAlign: "center" }}>
        <p>データがありません</p>

        {/* モード切替ボタン */}
        <div style={{ margin: "1rem 0" }}>
          <button onClick={() => setViewMode("all")}>All</button>
          <button onClick={() => setViewMode("bodyPart")}>Body Part</button>
          <button onClick={() => setViewMode("workoutName")}>Workout Name</button>
        </div>

        {/* 選択用ボタン */}
        {keys.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKey(k)}
                style={{
                  margin: "0 0.5rem",
                  fontWeight: selectedKey === k ? "bold" : "normal",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 400 }}>
      {/* viewMode 切り替えボタン */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <button onClick={() => setViewMode("all")}>All</button>
        <button onClick={() => setViewMode("bodyPart")}>By Body Part</button>
        <button onClick={() => setViewMode("workoutName")}>By Workout Name</button>
      </div>

      {/* bodyPart / workoutName 選択ボタン */}
      {keys.length > 0 && (
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKey(k)}
              style={{
                margin: "0 0.5rem",
                fontWeight: selectedKey === k ? "bold" : "normal",
              }}
            >
              {k}
            </button>
          ))}
        </div>
      )}

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
