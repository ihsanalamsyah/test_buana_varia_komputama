import logo from './logo.svg';
import './App.css';


import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import {Card, Accordion, Button} from 'react-bootstrap';
import Axios from 'axios';
import {useState, useRef, useEffect } from 'react';
import ReactStars from "react-rating-stars-component";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';


function App() {

  const [cats, setCats] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [nextPage, setNextPage] = useState(1);
  const [value, setValue] = useState("");

  const getCats = async () =>{
    const response = await Axios
    .get(`https://api.thecatapi.com/v1/breeds?limit=${limit}&page=${page}`)
    setValue("");
    document.getElementById("input_search").value = "";
    setCats(response.data)
    document.getElementsByClassName("button_load_more")[0].style.display = 'block';
    setNextPage(1)
  }

  useEffect(()=>{
    getCats()
  }, [])

  async function getSearchCat(){
    let response = await Axios
    .get(`https://api.thecatapi.com/v1/breeds/${value}`)
    const responseData = response.data
    const imageId = response.data.reference_image_id;
  
    let response2 = await Axios
    .get(`https://api.thecatapi.com/v1/images/${imageId}`)

    Object.assign(responseData, {image : {
      url : response2.data.url
    }})
    const newSearchCat = [responseData]
    document.getElementsByClassName("button_load_more")[0].style.display = 'none';
    return setCats(newSearchCat)
    
  }

  
  function handleScroll(e){
    const target = e.target;

    if(target.scrollHeight - target.scrollTop === target.clientHeight){
      loadMore();
    }
  }
  async function loadMore(){
    const response = await Axios
    .get(`https://api.thecatapi.com/v1/breeds?limit=${limit}&page=${nextPage}`)
    const newCats = response.data
    setCats([...cats, ...newCats])
    setNextPage(nextPage + 1)
  }

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);
    return (
      <a  
      className="center_card pointer a_detail"
      title='Click to see detail'     
      onClick={decoratedOnClick}
      >
        {children}
      </a>
    );
  }

  
  return (
    <>
    <div className="background">
    <div className="navigation_bar">
      <div>
        <b
        title='Click to home'
        className='pointer'
        onClick={getCats}
        >
        Daftar Kucing</b>
      </div>
   
      <div className='navbar_search'>
        <input
        placeholder='Search...'
        id='input_search'
        onChange={e => setValue(e.target.value)} 
        />
        <button
        className='button_search'
        title='Click to search by ID'
        onClick={getSearchCat}
        >
          Search
        </button>       

      </div>
    
    </div>
    <div className='cards' onScroll={e => handleScroll(e)}>

    {cats.map(function(data, i){
      const urlCFA = data.cfa_url;
      const urlWiki = data.wikipedia_url;
      const image = data.image;
      const weight = data.weight;
      return(
      <Card key={data.id}>
        {image !== undefined ? <Card.Img variant="top" src={data.image.url} /> : <Card.Img variant="top" />}
        <Card.Body>
          <Card.Title>{data.name}</Card.Title>
          <Card.Text>
            ID : {data.id}
          </Card.Text>
          
          <Card.Text className='justify description'>
            {data.description}
          </Card.Text>
          <div className='center_card'>---</div>
          <Card.Text className='justify temperament'>
            <i>{data.temperament}</i>
          </Card.Text>
          <Card.Text className='origin'>    
           Origin : {data.origin}
          </Card.Text>       
      <Accordion>
      <Accordion.Item eventKey="0">
        <CustomToggle eventKey="0">Details</CustomToggle>        
        <Accordion.Body className='justify accordion_body'>
          Life span : Average {data.life_span}
          <br></br>
          Weight Imperial : {data.weight.imperial} kgs
          <br></br>
          Weight Metric : {data.weight.metric} kgs
          <br></br>
          Adaptability
          <ReactStars
          count={5}         
          size={24}
          value={data.adaptability}
          activeColor="#ffd700"
          />
          Health Issues 
          <ReactStars
          count={5}         
          size={24}
          value={data.health_issues}
          activeColor="#ffd700"
          />
          <br></br>
          <div className='links'>
          {urlWiki !== undefined ? <a href={data.wikipedia_url} target="_blank" title='Open new tab wikipedia'>Wikipedia</a> : <a className='hide'>Wikipedia</a>}
          <br></br>
          {urlCFA !== undefined ? <a href={data.cfa_url} target="_blank" title='Open new tab CFA'>CFA Link</a>  : <a className='hide'>Cfa Url</a>}
          
          </div>
          
        </Accordion.Body>
      </Accordion.Item> 
      </Accordion>
        </Card.Body>
      </Card>
      )
    })}
    <button
    className='button_load_more'
    title='Click to load more'
    onClick={loadMore}
    >
    Load More
    </button>
    
    </div>
    <br></br>
    

    </div>
    
    
    </>
    
  );
}

export default App;
