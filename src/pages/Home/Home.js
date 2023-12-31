import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import Spinner from "../../components/Spinner/Spinner";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Filter from "../../components/Filter/Filter";
import { Link } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [filterParams, setFilterParams] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Getting games with the selected params
  const fetchGamesWithFilter = async (queryParams) => {
    const options = {
      method: "GET",
      url: `${environment.apiUrl}/games?${queryParams}`,
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com",
      },
    };

    try {
      setIsLoading(true);
      const response = await axios.request(options);
      setGames(response.data);
    } catch (error) {
      console.error("Error getting the filtered games list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesWithFilter(filterParams);
  }, [filterParams]);

  return (
    <div className="deep-grey-background full-screen-content">
      <Button className="overlay m-2" variant="light" onClick={handleShow}>
        <i className="bi bi-funnel"></i>
      </Button>
      <Offcanvas
        show={show}
        onHide={handleClose}
        bg="dark"
        data-bs-theme="dark"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter games</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Filter onApplyFilter={setFilterParams} />
        </Offcanvas.Body>
      </Offcanvas>
      <h2 className="text-center text-white py-2">Free-To-Play Games</h2>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <div className="row justify-content-center px-4 m-0">
          {games.map((game) => (
            <div
              className="card bg-dark mx-2 mb-3 p-0 col-lg-3 col-md-4 col-sm-6 col-12"
              key={game.id}
            >
              <img
                src={game.thumbnail}
                className="card-img-top"
                alt={game.title + "photo"}
              ></img>
              <div className="card-body text-white">
                <h5 className="card-title text-truncate">{game.title}</h5>
                <p className="card-text text-truncate">
                  {game.short_description}
                </p>
                <div className="card-text d-flex justify-content-between">
                  <Link to={"/game/" + game.id} className="text-white">
                    View game
                  </Link>
                  <div className="d-flex text-end justify-content-end">
                    <div className="rounded bg-secondary px-1 mx-2">
                      {game.genre}
                    </div>
                    {game.platform === "PC (Windows)" ? (
                      <i className="bi bi-windows"></i>
                    ) : (
                      <i className="bi bi-browser-chrome"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
