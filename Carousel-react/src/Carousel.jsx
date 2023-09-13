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
        {data.length > 0 ? (
          <Carousel data={data} slideToShow={2} speed={2000} />
        ) : (
          <p>Загрузка данных...</p>
        )}
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

  const [currentIndex ,setCurrentIndex] = useState(0);
  const [carouselData, setCarouselData] = useState([...data]);
  const duplicatedData = [...data];
  const maxIndex = data.length - slideToShow;
  const carouselRef = useRef(document.documentElement)

  // change styles width;
  useEffect(() => {
    carouselRef.current.style.setProperty('--slide-to-show', slideToShow);
  }, [slideToShow]);
  
  const nextClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex < data.length ? newIndex : newIndex;
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
        if (newIndex < data.length) {
          setCarouselData((prevData) => [...prevData, ...data]);
          return newIndex;
        } else {
          return newIndex
        }
      });
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [data, maxIndex, speed]);

  return (
    <div className="wrapper">
      <button onClick={prevClick}>Предыдущий</button>
      {carouselData.length > 0 ? (
        <div className="carousel">
            {carouselData.map((item, index) => (
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
