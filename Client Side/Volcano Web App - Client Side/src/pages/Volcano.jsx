import React, { useEffect } from "react";
import { Button } from "reactstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { headUrl } from "../URL";

//barchart
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
//map
import { Map, Marker, Overlay } from "pigeon-maps";
//token
import { token } from "./Login";
export default function Volcano() {
  //navigate
  const navigate = useNavigate();

  //search
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const volcanoID = searchParams.get("id");
  //volcano data
  const [volcano, setVocalno] = useState([]);

  //map
  function MyMap() {
    return (
      <Map
        height={600}
        // width={600}
        defaultCenter={[
          parseFloat(volcano.latitude),
          parseFloat(volcano.longitude),
        ]}
        defaultZoom={10}
      >
        <Overlay
          offset={[120, 79]}
          anchor={[parseFloat(volcano.latitude), parseFloat(volcano.longitude)]}
        >
          <img src="/img/icon.png" width={130} height={158} alt="" />
        </Overlay>
      </Map>
    );
  }
  //data for bar chart
  const state = {
    labels: ["5km", "10km", "30km", "100km"],
    datasets: [
      {
        label: "Population Density",
        color: "#e3e3e3",
        backgroundColor: "#f95959",
        borderColor: "#f95959",
        borderWidth: 1,
        data: [
          volcano.population_5km,
          volcano.population_10km,
          volcano.population_30km,
          volcano.population_100km,
        ],
      },
    ],
  };

  const option_state = {
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          color: "#e3e3e3",
          font: {
            size: 30,
          },
        },
      },
    },
    //customize the labels of bar chart
    scales: {
      yAxes: {
        ticks: {
          color: "#e3e3e3",
          font: {
            size: 20,
          },
        },
      },
      xAxes: {
        ticks: {
          color: "#e3e3e3",
          font: {
            size: 30,
          },
        },
      },
    },
  };
  //get volcano from provided ID
  function fetchVolcano() {
    const url = `${headUrl}/volcano/${volcanoID}`;
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (token != `undefined`) {
      return fetch(url, { headers })
        .then((res) => res.json())
        .then((res) => res);
    } else if (token == "undefined") {
      return fetch(url)
        .then((res) => res.json())
        .then((res) => res);
    }
  }

  //method to interate through an object's value to get needed data then display
  //on volcano page (this method is for reducing code repetition)
  function Volcano(props) {
    return (
      <div className="Volcano">
        {Object.keys(props)
          .slice(1, 8)
          .map(function (data, index) {
            return (
              <div>
                <label className={data}>{data}</label>
                <p1>{props[data]}</p1>
              </div>
            );
          })}
      </div>
    );
  }

  //render fresh details once
  useEffect(() => {
    fetchVolcano().then((volcano) => {
      setVocalno(volcano);
    });
  }, []);

  //Show all details of a volcano
  function DisplayVolcanoDetails() {
    return (
      <div className="App">
        <h1>Volcano Details</h1>
        <Volcano {...volcano} />
      </div>
    );
  }
  //volcano page's contents
  return (
    <div className="volcanoDetailsPage">
      <Button
        color="dark"
        size="sm"
        className="backButton"
        onClick={() => navigate("/volcanolist")}
      >
        BACK
      </Button>
      <h1></h1>
      <div>
        <label1>VOLCANO SELECTED</label1>
        <p1 className="volcanoName"> {name} </p1>
      </div>

      <div>
        <label1> ID </label1>
        <p1 className="volcanoID">{volcanoID}</p1>
      </div>

      <div className="volcanolAllDetails">
        <DisplayVolcanoDetails />
        <MyMap />
      </div>
      {/* chart */}
      {token != "undefined" ? (
        <Bar data={state} options={option_state} />
      ) : null}
    </div>
  );
}
