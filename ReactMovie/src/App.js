import React, { useState, useEffect } from 'react';
import './bootstrap/bootstrap.min.css';
import './bootstrap/bootstrap.css';
import './bootstrap/bootstrap-grid.css';
import './bootstrap/bootstrap-reboot.css';
import './App.css';
import MovieList from './Components/MovieList';
import MovieListHeading from './Components/MovieListHeading';
import SearchBox from './Components/SearchBox';
import AddFavourites from './Components/AddToFavourites';
import { addVideosMethod, getVideosByUserIdMethod, deleteVideoById } from "./api/api";
import RemoveFavourites from './Components/RemoveFavourites';
import { useSelector } from 'react-redux';

const App = () => {
	const [movies, setMovies] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [favourites, setFavourites] = useState([]);
	const [item, setItem] = useState()
	const [videos, setVideos] = useState([])
	const [isVideoIncluded, setIsVideoIncluded] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const user = useSelector(state => state.user)
	const getVideos = async () => {
		let res = await getVideosByUserIdMethod()
		// console.log("videos", res?.data)
		if (res?.success) {
			if (res?.data.length) {
				await setVideos(res?.data)
				console.log(res?.data, 'data');
			}
		}
		else {
			alert(res?.message)
		}

	}
	useEffect(() => {
		getVideos()
	}, [])
	useEffect(() => {
		setRefresh(!refresh)
		const isVideoInArray = videos.some((video) => video?.video?.id === item?.id);
		if (isVideoInArray && !isVideoIncluded) {
			setIsVideoIncluded(true);
		} else if (!isVideoInArray && isVideoIncluded) {
			setIsVideoIncluded(false);
		}
		console.log(videos, 'videos');
	}, [videos])
	useEffect(() => {
		setRefresh(!refresh)
	}, [item])
	useEffect(() => {
		setRefresh(!refresh)
	}, [isVideoIncluded])



	const getMovieRequest = async (searchValue) => {
		const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;

		const response = await fetch(url);
		const responseJson = await response.json();

		if (responseJson.Search) {
			setMovies(responseJson.Search);
		}

	};
	const addItemToDB = async (item) => {
		const isVideoInArray = videos.some((video) => video?.video?.Title === item?.Title);
		console.log(videos, 'videos');
		console.log(isVideoInArray, 'isVideoInArray');
		// if (isVideoInArray && !isVideoIncluded) {
		// 	setIsVideoIncluded(true);
		// } else if (!isVideoInArray && isVideoIncluded) {
		// 	setIsVideoIncluded(false);
		// }
		if (!isVideoInArray) {
			let body = {
				type: "Movie",
				video: item,
				createdAt: Date.now(),
				createdBy: user?.uid
			}
			console.log(item, 'item');
			// console.log(body)
			let res = await addVideosMethod(body)
			// let res = true
			if (res?.success) {
				alert("added to Favorites")
				await getVideos()
			} else {
				alert("something went wrong")
			}
		} else {
			alert('Already added to favorites')
		}
	}

	const addFavouriteMovie = async (movie) => {
		await setItem(movie)
		console.log(movie, 'movie');
		await addItemToDB(movie)
		// const newFavouriteList = [...favourites, movie];
		// setFavourites(newFavouriteList);
	};
	const deleteVideoHandler = async (videoID) => {
		let res = await deleteVideoById(videoID)
		if (res?.success) {

			alert("Removed from favorites")
			console.log(videos, 'videos');
			let res = await getVideosByUserIdMethod().then((async res => {
				if (res?.success) {
					await setVideos(res?.data)
					console.log(res?.data, 'dataers');
				} else {
					alert(res.message)
				}
			}))
			// console.log("videos", res?.data)
			if (res?.success) {
				if (res?.data.length) {
					await setVideos(res?.data)
					console.log(res?.data, 'data');
				}
			}

		} else {
			alert('Something went wrong')
		}
	}
	const removeFavouriteMovie = (movie) => {
		deleteVideoHandler(movie?.id)
	};

	useEffect(() => {
		getMovieRequest(searchValue);
	}, [searchValue]);

	return (
		<div className='container-fluid movie-app'>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Movies' />
				<SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
			</div>
			<div className='row'>
				<MovieList
					movies={movies}
					favouriteComponent={AddFavourites}
					handleFavouritesClick={addFavouriteMovie}
				/>
			</div>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Favourites' />
			</div>
			<div className='row'>
				<MovieList
					movies={videos?.map((item => {
						return {
							...item.video,
							"id": item?.id,
							"createdBy": item?.createdBy,
							"type": item?.type,
							"createdAt": item?.createdAt
						}
					})) || []}
					handleFavouritesClick={removeFavouriteMovie}
					favouriteComponent={RemoveFavourites}
				/>
			</div>
		</div>
	);
};

export default App;