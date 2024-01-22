import React, { useEffect, useState } from 'react';

import './MyPost.scss';
import {
  API_BASE_URL,
  QUESTIONBOARD,
  CATEGORYBOARD,
} from '../../../config/host-config.js';
import { NavLink, useNavigate } from 'react-router-dom';

import { board } from '../../../assets/constants/index.js';
import SideBarItem2 from '../../SideBar/SideBar2/SideBarItem2.js';

import icon1 from '../../../assets/img/icon1.png';
import icon2 from '../../../assets/img/icon2.png';
import { getLoginUserInfo } from '../../../utils/AuthContext.js';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const MyPost = () => {
  const [data, setData] = useState([]);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [countNum, setCountNum] = useState(false);
  const userId = getLoginUserInfo().userid; // 현재 로그인한 사용자의 ID를 가져온다고 가정함.
  const REQUEST_URL = `${API_BASE_URL}${QUESTIONBOARD}?userId=${userId}`;
  const REQUEST_URL_Category = `${API_BASE_URL}${CATEGORYBOARD}/entire`;

  const redirection = useNavigate();

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [realCurrentPage, setRealCurrentPage] = useState(1);

  const onClickApprove = () => {
    redirection('/board/donation/mypage/approve');
  };
  const onClickReject = () => {
    redirection('/board/donation/mypage/reject');
  };
  const onClickHold = () => {
    redirection('/board/donation/mypage/hold');
  };

  const myboard = [
    { name: '내가 쓴 게시글', path: '/mypage/mypost' },
    { name: '나의 나눔 게시판', path: '/board/donation/mypage' },
  ];

  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
    setIsOpen(false);
  };

  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언
    Authorization: 'Bearer ' + localStorage.getItem('LOGIN_TOKEN'),
  };

  const fetchData = async () => {
    try {
      const res = await fetch(REQUEST_URL, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('LOGIN_TOKEN'),
        },
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();

      const res2 = await fetch(REQUEST_URL_Category, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('LOGIN_TOKEN'),
        },
      });
      if (!res2.ok) {
        throw new Error('Network response was not ok');
      }

      const result2 = await res2.json();

      console.log(result);
      console.log(result2);

      // const i = 1;
      let processedData = [];

      if (result.length > 0) {
        processedData.push(
          ...result
            .filter((item) => item.userId === userId)
            .map((item, index) => ({
              rowNumber: index + 1,
              boardId: item.boardId,
              category: 'qna',
              title: item.title,
              content: item.content,
              regDate: new Date(item.regDate).toISOString().split('T')[0],
              userId: item.userId,
              userName: item.userName,
            }))
        );
      } else {
        console.log('No data received from the server.');
      }

      if (result2.length > 0) {
        processedData.push(
          ...result2
            .filter((item) => item.userId === userId)
            .map((item, index) => ({
              rowNumber: index + 1,
              boardId: item.boardId,
              category: item.category,
              title: item.title,
              content: item.content,
              regDate: new Date(item.regDate).toISOString().split('T')[0],
              userId: item.userId,
              userName: item.userName,
            }))
        );
      } else {
        console.log('No data received from the server.');
      }

      console.log(processedData);
      // 데이터를 regDate 기준으로 내림차순 정렬
      processedData.sort((a, b) => b.rowNumber - a.rowNumber);
      processedData = processedData.map((item, index) => ({
        ...item,
        rowNumber: index + 1,
      }));

      // 데이터를 상태에 업데이트
      setData(processedData);

      setStartIndex((realCurrentPage - 1) * 10);
      setEndIndex(realCurrentPage * 10);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const processedData = data.map((item) => ({
    boardId: item.boardId,
    title: item.title,
    userId: item.userId,
    regDate: item.regDate,
    content: item.content,
    // userName: item.userName,
  }));

  const boarddetailhandleClick = (boardId, category) => {
    // 선택된 아이템에 대한 로직을 수행
    console.log(boardId, category);
    if (category === 'qna') {
      redirection('/board/question/detail', { state: { board: boardId } });
    } else {
      redirection('/board/onelife/detail', {
        state: { boardId: boardId, category: category },
      });
    }
    //redirection('/board/question/detail', { state: { board: boardId } });
  };

  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);

  const beforePageHandler = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    // setStartIndex(startIndex - 10);
    // setEndIndex(endIndex - 10);
    setCountNum(false);
  };

  const afterPageHandler = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    // setStartIndex(startIndex + 10);
    // setEndIndex(endIndex + 10);
  };

  const pageNumHandler = (pageNumber) => {
    const buttonText = pageNumber.target.innerText;
    //setCurrentPage(pageNumber);
    setStartIndex((buttonText - 1) * 10);
    setEndIndex(buttonText * 10);
    setRealCurrentPage(Number(buttonText));
  };

  useEffect(() => {
    fetchData();
  }, []); // 컴포넌트가 마운트될 떄 게시글 데이터를 가져온다.

  const RenderPageButtons = () => {
    const startNumber = (currentPage - 1) * itemsPerPage + 1;
    const endNumber = startNumber + itemsPerPage - 1;
    let pageNumber;

    return Array.from({ length: itemsPerPage }).map((_, index) => {
      if (data.length <= (startNumber + index - 1) * 10) {
        return <></>;
      } else {
        pageNumber = startNumber + index;
      }

      return (
        <>
          {realCurrentPage === pageNumber ? (
            <PaginationItem active>
              <PaginationLink
                key={pageNumber}
                onClick={pageNumHandler}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem>
              <PaginationLink
                key={pageNumber}
                onClick={pageNumHandler}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )}
        </>
      );
    });
  };

  return (
    <>
      <board id='myboard'>
        <div
          className='ppps'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-40%, -40%)',
          }}
        >
          <div id='community'>
            <div className='overlap-wrapper'>
              <div className='overlap1'>
                <div className='content-text-wrapper'>
                  <div className='text-wrapper a1'>No</div>
                  {/* <div className='text-wrapper a2'>게시판</div> */}
                  <div className='text-wrapper a3'>제목</div>
                  <div className='text-wrapper a4'>글쓴이</div>
                  <div className='text-wrapper a5'>작성일자</div>
                </div>
                <div className='overlap-group1'>
                  {data.slice(startIndex, endIndex).map((item) => (
                    <div
                      key={item.boardId}
                      className='content-text-wrapper1'
                      onClick={() =>
                        boarddetailhandleClick(item.boardId, item.category)
                      }
                    >
                      <div className='text-wrapper a1'>{item.rowNumber}</div>
                      <div className='text-wrapper a3'>{item.title}</div>
                      <div className='text-wrapper a4'>
                        {item.userName}
                        {/* {item.userName.substring(0, item.userName.length - 1) + '*'} */}
                      </div>
                      <div className='text-wrapper a5'>{item.regDate}</div>
                    </div>
                  ))}
                </div>
                <Pagination className='pagination'>
                  <PaginationItem>
                    <PaginationLink
                      previous
                      onClick={beforePageHandler}
                    />
                  </PaginationItem>
                  <RenderPageButtons />
                  {countNum ? (
                    ''
                  ) : (
                    <PaginationItem>
                      <PaginationLink
                        next
                        onClick={afterPageHandler}
                      />
                    </PaginationItem>
                  )}
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </board>
      <div>
        <div
          className='rec_center2'
          onMouseLeave={handleMouseLeave}
        >
          MyBoard
          <div className='side2'>
            <div className='sidebar2'>
              {myboard.map((menu, index) => (
                <div
                  className='sidebar-item2'
                  key={index}
                >
                  {menu.name === '나의 나눔 게시판' ? (
                    <div onMouseEnter={handleMouseEnter}>
                      <NavLink
                        to={menu.path}
                        activeClassName='active-link'
                        exact
                      >
                        <p>{menu.name}</p>
                      </NavLink>
                      {isHover && (
                        <>
                          <p
                            onClick={onClickHold}
                            style={{
                              fontSize: '14px',
                              width: '150px',
                              padding: '3px 10px',
                              margin: '5px 0px',
                              position: 'absolute',
                              bottom: '-2%',
                              textAlign: 'center',
                              textDecoration: 'none',
                              marginLeft: '25px',
                              color: '#000',
                              display: 'block',
                              borderRadius: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            미승인 게시판
                          </p>
                          <p
                            onClick={onClickApprove}
                            style={{
                              fontSize: '14px',
                              width: '150px',
                              padding: '3px 10px',
                              margin: '5px 0px',
                              position: 'absolute',
                              bottom: '-26%',
                              textAlign: 'center',
                              textDecoration: 'none',
                              marginLeft: '25px',
                              color: '#000',
                              display: 'block',
                              borderRadius: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            승인 게시판
                          </p>
                          <p
                            onClick={onClickReject}
                            style={{
                              fontSize: '14px',
                              width: '150px',
                              padding: '3px 10px',
                              margin: '5px 0px',
                              position: 'absolute',
                              bottom: '-50%',
                              textAlign: 'center',
                              textDecoration: 'none',
                              marginLeft: '25px',
                              color: '#000',
                              display: 'block',
                              borderRadius: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            보류 게시판
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={menu.path}
                      activeClassName='active-link'
                      exact
                    >
                      <p>{menu.name}</p>
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPost;
