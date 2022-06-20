//import Home from "./Home"
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridReact } from "ag-grid-react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge } from "reactstrap";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React, { Component }  from 'react';

import SearchBar from "../components/SearchBar";

import { headUrl } from "../URL";

export default function VolcanoList() {
  const [rowData, setRowData] = useState([]);
  const [searchOption, setSearchOption] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { headerName: "Name", field: "name",
     sortable: true, filter: true},
    { headerName: "Country", field: "country",
     sortable: true, filter: true },
    { headerName: "Region", field: "region",
    sortable: true, filter: true },
    { headerName: "Sub Region", field: "subregion",
    sortable: true, filter: true },
    { headerName: "Volcano ID", field: "id",
    sortable: true, filter: true },
  ];

  //get volcanoes in chosen country option and distance option
  useEffect(() => {
    fetch(`${headUrl}/volcanoes?country=${searchOption.countryName}&populatedWithin=${searchOption.distanceOption}`)
    .then(res => res.json())
    .then(res => res)
    .then(res => 
       res.map(volcano => {
           return{
               name: volcano.name,
               country: volcano.country,
               region: volcano.region,
               subregion: volcano.subregion,
               id: volcano.id
           }
       }))
       .then(volcanoes => setRowData(volcanoes));
}, [searchOption]);   

/*A section component for the volcano list page's body*/ 
  function volcanoListHero(){
    return(
      /*Hero contents */
      <section className="formHero">
        <div className="container">
          <h1>
             Volcanoes in a country
          </h1>
          <p>
          <SearchBar onSubmit={setSearchOption}/>  
            <Badge 
            className="volcanoNums"
            color="dark">
              {rowData.length}
              </Badge>
                   Volcanoes spotted below
               </p>
            <div
            className="ag-theme-balham"
            style={{
                height: "500px",
                width: "1010px"
            }}
            > 
            
            <AgGridReact 
                columnDefs={columns}
                rowData={rowData}
                pagination={true}
                paginationPageSize={15}
                onRowClicked={(row) => 
                    navigate(`/volcano?name=${row.data.name}&id=${row.data.id}`)}
                />
                
            </div>
            <Button
                color="dark"
                size="sm"
                className="mt-3"
                href={`${headUrl}/#/Data/get_volcanoes`}
                target="_blank"
            >
                Go to Open Volcano API
            </Button>
    </div>
      </section>
    )
  }
  return (
      <main>
        {volcanoListHero()}
      </main>
  );
}



