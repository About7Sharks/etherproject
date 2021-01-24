import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-annotation";
import { Button, Input } from "antd";
import { Select } from "antd";
const { Option } = Select;
interface ChartProps {
  coin: string;
  currency: string;
  days: number;
}
export const Chart: React.FC<ChartProps> = (
  { coin = "bitcoin", currency, days },
) => {
  const [query, setQuery] = useState<ChartProps>({ coin, currency, days });
  const [data, setData] = useState({ prices: [] });
  const [annotationArray, setAnnotationArray] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [currentSelect, setCurrentSelect] = useState("bitcoin");
  const handleSelectChange = (e: any) => {
    console.log(e);
    setCurrentSelect(e);
  };
  useEffect(() => {
    async function getList() {
      setSelectList(
        await (await fetch("https://api.coingecko.com/api/v3/coins/list"))
          .json(),
      );
    }
    getList();
  }, []);
  const createAnnotations = async () => {
    let prices = data.prices.map((item) => item[1]);
    let maxP = Math.max(...prices);
    let minP = Math.min(...prices);
    let priceDiff = maxP - minP;
    let fiboLevels = [
      maxP,
      maxP - priceDiff * 0.236,
      maxP - priceDiff * 0.382,
      maxP - priceDiff * 0.5,
      maxP - priceDiff * 0.618,
      maxP - priceDiff * 0.786,
      maxP - priceDiff,
    ];
    console.log(selectList);
    let currentValue = (await (await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${query.coin}&vs_currencies=${query.currency}`,
    )).json())[`${query.coin}`].usd;
    let currentPrice = {
      value: currentValue,
      type: "line",
      mode: "horizontal",
      scaleID: "y-axis-0",
      borderColor: "rgba(0, 119, 290, 0.3)",
      borderWidth: 2,
      label: {
        backgroundColor: "rgba(0, 119, 290, 0.6)",
        content: `Current Price: $${currentValue.toFixed(2)}`,
        enabled: true,
      },
    };

    let fiboAnnoatations = fiboLevels.map((level) => {
      return {
        type: "line",
        mode: "horizontal",
        scaleID: "y-axis-0",
        value: level,
        borderColor: "#68057C",
        borderWidth: 2,
        label: {
          backgroundColor: "#68057C",
          //content: "Test Label",
          enabled: true,
        },
      };
    });
    console.log(currentPrice);
    return [
      ...fiboAnnoatations,
      currentPrice,
    ];
  };
  const fetchData = async () => {
    setData(
      (await (await fetch(
        `https://api.coingecko.com/api/v3/coins/${query.coin}/market_chart?vs_currency=${query.currency}&days=${query.days}`,
      ))
        .json()),
    );
    console.log(
      (await (await fetch(
        `https://api.coingecko.com/api/v3/coins/${query.coin}/market_chart?vs_currency=${query.currency}&days=${query.days}`,
      ))
        .json()),
    );
    return "fetched data";
  };
  useEffect(() => {
    fetchData();
  }, [query]);
  useEffect(() => {
    async function func() {
      return setAnnotationArray(await createAnnotations() as any);
    }
    func();
  }, [data]);
  return (
    <div className="chart">
      <span>
        <Select
          showSearch
          onChange={handleSelectChange}
          defaultValue={query.coin}
          id="coin"
          value={currentSelect}
        >
          {selectList.map((item: any) => {
            return <Option value={item.id}>{item.name}</Option>;
          })}
        </Select>
        <Input
          defaultValue={query.days}
          type="number"
          id="days"
        />
        <Input
          defaultValue={query.currency}
          placeholder={query.currency}
          type="text"
          id="currencey"
        />
        <Button
          onClick={() => {
            setQuery({
              coin: currentSelect.toLowerCase(),
              days: (document.getElementById("days") as any).value,
              currency: (document.getElementById("currencey") as any).value,
            });
          }}
        >
          Search
        </Button>
      </span>
      <Line
        options={{
          annotation: {
            annotations: annotationArray,
          },
          resonsive: true,
          legend: {
            display: false,
          },
          title: {
            display: false,
            // text: query.coin.toUpperCase(),
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: "red",
              },
            }],
            xAxes: [{
              ticks: {
                fontColor: "green",
              },
            }],
          },
        }}
        data={{
          labels: data.prices.map((i) => {
            return new Date(i[0]).toDateString();
          }),
          datasets: [
            {
              label: query.coin,
              data: data.prices.map((i: any) => {
                return i[1].toFixed(2);
              }),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
              ],
              borderWidth: 1,
              pointRadius: 0,
            },
          ],
        }}
      />
    </div>
  );
};
