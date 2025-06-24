// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Statistika yüklənmədi:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Yüklənir...</p>;

  const chartData = {
    labels: ["İstifadəçilər", "Reseptlər", "Kateqoriyalar", "Gəlir"],
    datasets: [
      {
        label: "Statistika",
        data: [
          stats.userCount,
          stats.recipeCount,
          stats.categoryCount,
          stats.totalIncome,
        ],
        fill: false,
        borderColor: "#00DFA2",
        backgroundColor: "#00DFA2",
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <h3>Ümumi Rəqəmlər</h3>
          <ul>
            <li>İstifadəçilər: {stats.userCount}</li>
            <li>Reseptlər: {stats.recipeCount}</li>
            <li>Kateqoriyalar: {stats.categoryCount}</li>
            <li>Gəlir: {stats.totalIncome} ₼</li>
          </ul>
        </div>

        <div style={{ width: "400px" }}>
          <h3>Qrafik</h3>
          <Line data={chartData} />
        </div>
      </div>

      <h3>Son Qeydiyyat edənlər</h3>
      <ul>
        {stats.recentUsers.map((u) => (
          <li key={u._id}>
            {u.username || "İstifadəçi"} – {new Date(u.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
