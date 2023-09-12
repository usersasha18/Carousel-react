import { useGetData as useData } from "./assets/components/useGetData";
import { useEffect, useState, useRef } from "react";
import "./Slider.css"

//get data and images component
export default function Slider() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const getDataFetcher = async () => {
        const result = await useData('./data.json', "GET");
        setData(result);
      };
  
      if (!loading) {
        getDataFetcher();
        setLoading(true);
      }
  }, [loading]);

  return (
      <>
        <Carousel data={data} slideToShow={2} speed={2000}/>
      </>
  )
}

// main component
function  Carousel({ data, slideToShow, speed}) {
  if(slideToShow === 0) {
    return (
      <div>Слайдов нет</div>
    )
  }

  const [currentIndex ,setCurrentIndex] = useState(0)
  const maxIndex = data.length - slideToShow;
  const carouselRef = useRef(document.documentElement)


  // change styles width;
  useEffect(() => {
    carouselRef.current.style.setProperty('--slide-to-show', slideToShow);
  }, [slideToShow]);
  
  const nextClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex > maxIndex ? 0 : newIndex;
    });
  }

  const prevClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex  < 0 ? maxIndex : newIndex;
    });
  }

  // sliwe slides
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + slideToShow;
        return newIndex > maxIndex ? 0 : newIndex;
      });
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [data, maxIndex, speed]);

  return (
<div className="wrapper">
  <button onClick={prevClick}>Предыдущий</button>
  {data.length > 0 ? (
    <div className="carousel">
      {data.map((item, index) => (
        <img key={index} src={item.image} alt="" style={{ transform: `translateX(-${currentIndex * (100 + slideToShow)}%)` }}/>
      ))}
    </div>
  ) : (
    <p>netu slidov</p>
  )}
  <button onClick={nextClick}>Следующий</button>
</div>
  )
}
