import React, {useState} from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/host-config';
import './LikeItem.scss';
import { useNavigate } from 'react-router-dom';
import Loading from '../../LoadingBar/Loading';

function LikeItem({ id, src, title, handleLike }) {
  const [loading, setLoading] = useState(false);
  //화면 전환 위해
  const redirection = useNavigate();

  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언
    Authorization: 'Bearer ' + localStorage.getItem('LOGIN_TOKEN'),
  };

  const handleClick = () => {
    handleLike(title, src);
  };
  
  const fetchDetail=async (name, e) => {
    if (
      e.target.classList.contains('heart-icon') &&
      e.target.tagName === 'BUTTON'
    ) {
      console.log('heart-icon 클래스명을 가진 div 태그가 클릭되었습니다.');
      return;
    }
    setLoading(true);
    console.log(
      `메뉴명: ${name}인 레시피 상세 요청!`
    );

    try {
      // await onDetailClick();
      const res = await axios.get(
        API_BASE_URL +
          '/api/menu/recipe/detail/' +
          name 
      );
      const data = await res.data.COOKRCP01.row; // []
      console.log(data);
      console.log(data[0]);

      // if (data.length > 0) {
      // setDetailData(data[0]);
      // setIsClicked(true);
      // 경로 이동 시 데이터 전달 가능
      redirection('/food/recipes/detail', { state: { data } });
      // }
      setLoading(false);
    } catch (error) {
      console.error('레시피 상세보기 요청에 실패했습니다.', error);
    }
  };

  return (
    <div className='content-item-mypage' onClick={(e)=>fetchDetail(title, e)}>
      {loading ? <Loading /> : null}
      <img
        src={src}
        alt={title}
      />
      <p>{title}</p>
      <button
        onClick={handleClick}
        className='heart-icon'
      ></button>
    </div>
  );
}

export default LikeItem;
