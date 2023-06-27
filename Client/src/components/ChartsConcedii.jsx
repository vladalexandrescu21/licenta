import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Text,
} from "recharts";
import styles from "../css/chartsConcedii.module.css";

export const ChartsConcedii = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [concedii, setConcedii] = useState([]);
  const [departamente, setDepartamente] = useState([]);
  const navigate = useNavigate();

  function inapoi() {
    navigate("/paginaSef", { replace: true });
  }

  useEffect(() => {
    async function getAllConcedii() {
      const result = await fetch("http://localhost:8080/api/getAllConcedii", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (result.status === 201) {
        const data = await result.json();
        setConcedii(data);
      }
    }

    getAllConcedii();
  }, []);

  useEffect(() => {
    async function getAllDepartamente() {
      const result = await fetch(
        "http://localhost:8080/api/getAllDepartamente",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (result.status === 201) {
        const data = await result.json();
        setDepartamente(data);
      }
    }

    getAllDepartamente();
  }, []);

  // Preprocesarea datelor pentru graficul cu numărul de concedii pe departamente
  const processDataForChart = () => {
    const dataMap = {};

    // Inițializați maparea datelor pentru fiecare departament cu valoarea 0
    departamente.forEach((departament) => {
      dataMap[departament.numeDepartament] = 0;
    });

    // Numărați concediile pentru fiecare departament
    concedii.forEach((concediu) => {
      const departament = departamente.find(
        (dep) => dep.id === concediu.departamenteId
      );
      if (departament) {
        dataMap[departament.numeDepartament]++;
      }
    });

    // Convertiți maparea într-un array de obiecte
    const chartData = Object.keys(dataMap).map((departament) => ({
      departament,
      concedii: dataMap[departament],
    }));

    return chartData;
  };

  const chartData = processDataForChart();

  // Definiți culorile pentru sectoarele graficului
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Preprocesarea datelor pentru graficul cu primele 3 perioade de concediu de top
  const processTopPeriodsData = () => {
    const periodMap = {};

    concedii.forEach((concediu) => {
      const { data_initiala, data_finala } = concediu;
      const startDate = new Date(data_initiala).toLocaleDateString();
      const endDate = new Date(data_finala).toLocaleDateString();
      const period = `${startDate} - ${endDate}`;

      if (periodMap[period]) {
        periodMap[period].count++;
      } else {
        periodMap[period] = { count: 1, startDate, endDate };
      }
    });

    const sortedPeriods = Object.values(periodMap).sort(
      (a, b) => b.count - a.count
    );

    const topPeriods = sortedPeriods.slice(0, 3).map((period, index) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const overlappingCount = period.count;

      return {
        index,
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        startDate,
        endDate,
        overlappingCount,
      };
    });

    return topPeriods;
  };

  const topPeriodsData = processTopPeriodsData();

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { startDate, endDate } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Perioadă: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}</p>
        </div>
      );
    }

    return null;
  };
  const renderCustomXAxisTick = ({ x, y, payload }) => {
    const { index, period } = payload;

    return (
      <Text
        x={x}
        y={y}
        width={100}
        textAnchor="middle"
        className="custom-x-axis-tick"
      >
        {period}
      </Text>
    );
  };

  return (
    <div className={`${styles["font-link"]} ${styles["form-container"]}`}>
      <h1>Grafice concedii</h1>
      <Text x={300} y={30} textAnchor="middle">
        Numărul de concedii pe departamente
      </Text>
      <PieChart width={600} height={400}>
        <Pie
          data={chartData}
          dataKey="concedii"
          nameKey="departament"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={(value) => {
            const departament = departamente.find(
              (dep) => dep.numeDepartament === value
            );
            return `${departament?.numeDepartament} (${value})`;
          }}
        />
      </PieChart>
      <h1>Top Perioade Concediu</h1>
      {topPeriodsData.length > 0 ? (
        <BarChart width={600} height={400} data={topPeriodsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            tick={renderCustomXAxisTick}
            payload={topPeriodsData}
          />
          <YAxis />
          <Tooltip content={renderCustomTooltip} />
          <Legend />
          <Bar dataKey="overlappingCount">
            {topPeriodsData.map((period, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <p>Nu există perioade de concediu care să se suprapună.</p>
      )}
      <Button onClick={inapoi} variant="primary" className="mt-3">
        Înapoi
      </Button>
    </div>
  );
};
