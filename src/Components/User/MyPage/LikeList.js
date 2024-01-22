import React, { useState } from 'react';
import LikeItem from './LikeItem';
import { NavLink } from 'react-router-dom';
import SideBarItem2 from '../../SideBar/SideBar2/SideBarItem2';
import '../../SideBar/SideBar2/SideBarItem2.scss';
import { mypage } from '../../../assets/constants';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/host-config';
import './LikeList.scss';

function LikeList() {
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언
    Authorization: 'Bearer ' + localStorage.getItem('LOGIN_TOKEN'),
  };
  const fetchData = async () => {
    const res = await axios.get(API_BASE_URL + '/api/menu/recipe/like', {
      headers: requestHeader,
    });

    if (res.status === 200) {
      console.log('data:', res.data);
      setItems(res.data);
    }
  };

  useState(() => {
    fetchData();
  }, [items]);

  const handleLike = (title, src) => {
    const isWishAdd = true;

    fetch(API_BASE_URL + '/api/menu/recipe/like', {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        // userId: token,
        recipeName: title,
        recipeImg: src,
        done: !isWishAdd,
      }),
    })
      .then((res) => {
        // console.log(res.json);
        if (res.status === 200) {
          // alert('찜 완료!');
          return res.json();
        } else if (res.status === 403) {
          alert('로그인이 필요한 서비스입니다.');
          return;
        } else if (res.status === 406) {
          alert('찜은 한 번만 할 수 있습니다.');
          return;
        } else {
          alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요!');
          return;
        }
      })
      .then((json) => {
        if (!json) {
          return;
        } else if (json.done === true) {
          alert('찜했어요!');
        } else {
          alert('찜이 취소되었습니다.');
        }

        fetchData();
      });
  };

  return (
    <div
      id='mypage-likeList'
      className='content-wrap'
    >
      <div className='rec_center2'>
        MyPage
        <div className='side2'>
          <div className='sidebar2'>
            {mypage.map((menu, index) => {
              return (
                <NavLink
                  style={{ textDecoration: 'none' }}
                  to={menu.path}
                  key={index}
                >
                  <SideBarItem2 menu={menu} />
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
      <div className='contentbox-wrap'>
        <h2>내가 좋아요한 목록</h2>
        <div className='contentBox'>
          {items.length === 0 ? (
            <p>좋아요한 항목이 없습니다.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <LikeItem
                    id={item.id}
                    title={item.recipeName}
                    src={item.recipeImg}
                    handleLike={handleLike}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default LikeList;
