
import React from "react";
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

  // データが空なら早期リターン
  if (!monthlyStats?.all?.length) {
    return <p style={{ textAlign: "center" }}>データがありません</p>;        
  }
 

  return (
    <div style={{ width: "100%", height: 300, minWidth: 0 }}>
      <button>All</button>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data= {monthlyStats.all}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />   {/*グラフ背景に格子線がつく。3 3は点線のスタイル*/}
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />  {/* 横軸, dataKey="date: データ配列内ののDateフィールドを使うよ、という意味*/}
          <YAxis />   {/* 縦軸　*/}
          <Tooltip   
            formatter={(value, name) =>
              name === "maxRM" ? `${value} RM` : `${value} kg`
            }
          />  マウスをグラフに乗せたときに、値を吹き出しで表示する
          <Legend />  * 折れ線の凡例を表示(ここではmaxRM, maxWeight)
          <Line
            type="monotone"
            dataKey="maxRM"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Max RM"
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="maxWeight"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Max Weight (kg)"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
