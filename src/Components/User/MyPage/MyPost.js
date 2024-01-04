import React, { useEffect, useState } from 'react';

import './MyPost.module.scss';
import { API_BASE_URL, QUESTIONBOARD } from '../../../config/host-config.js';
import { NavLink, useNavigate } from 'react-router-dom';

import { board } from '../../../assets/constants/index.js';
import SideBarItem2 from '../../SideBar/SideBar2/SideBarItem2.js';

import icon1 from '../../../assets/img/icon1.png';
import icon2 from '../../../assets/img/icon2.png';

const MyPost = () => {
  const [data, setData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [countNum, setCountNum] = useState(false);
  const userId = localStorage.getItem('USER_ID'); // 현재 로그인한 사용자의 ID를 가져온다고 가정함.
  const REQUEST_URL = `${API_BASE_URL}${QUESTIONBOARD}?userId=${userId}`;
  const redirection = useNavigate();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

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
      const res = await fetch(REQUEST_URL);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();

      // const i = 1;

      if (result.length > 0) {
        const processedData = result.map((item, index) => ({
          rowNumber: index + 1,
          boardId: item.boardId,
          title: item.title,
          content: item.content,
          regDate: new Date(item.regDate).toISOString().split('T')[0],
          userId: item.userId.slice(0, 4),
          userName: item.userName,
        }));

        // 데이터를 regDate 기준으로 내림차순 정렬
        processedData.sort((a, b) => b.rowNumber - a.rowNumber);

        // 데이터를 상태에 업데이트
        setData(processedData);
      } else {
        console.log('No data received from the server.');
      }
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

  const boarddetailhandleClick = (boardId) => {
    // 선택된 아이템에 대한 로직을 수행
    redirection('/board/question/detaile', { state: { board: boardId } });
  };

  // const QnaAddBoardHandler = async () => {
  //   const titleAddElement = document.getElementsByClassName('title')[0];
  //   const contentAddElement = document.getElementsByClassName('content')[0];
  //   const titleAdd = titleAddElement ? titleAddElement.value : '';
  //   const contentAdd = contentAddElement ? contentAddElement.value : '';
  //   document.getElementsByClassName('title')[0].value = '';
  //   document.getElementsByClassName('content')[0].value = '';

  //   if (!titleAdd || !contentAdd) {
  //     alert('제목과 내용을 모두 입력해주세요.');
  //     return; // 요청을 보내지 않고 함수를 종료
  //   }

  //   if (!localStorage.getItem('LOGIN_TOKEN')) {
  //     alert('로그인 후 이용해주세요');
  //     return;
  //   }

  //   const BoardAdd = await fetch(REQUEST_URL, {
  //     method: 'POST', // 또는 'PUT'에 따라 사용하고자 하는 HTTP 메서드 선택
  //     headers: requestHeader,
  //     body: JSON.stringify({
  //       title: titleAdd, // 이 부분에서 직접 사용
  //       content: contentAdd, // 이 부분에서 직접 사용
  //     }),
  //   });
  //   // setRefresh((prevRefresh) => prevRefresh + 1);

  //   fetchData();
  // };

  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);
  const beforePageHandler = () => {
    // setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    // setCountNum(false);
    if (startIndex > 0) {
      setStartIndex(startIndex - 10);
      setEndIndex(endIndex - 10);
    }
  };

  const afterPageHandler = () => {
    // setCurrentPage((prevPage) => prevPage + 1);
    // 총 페이지 수 계산

    if (currentPage < totalPages) {
      // 다음 페이지로 이동할 경우
      setCurrentPage((prevPage) => prevPage + 1);
      setStartIndex((prevIndex) => prevIndex + pageSize);
      setEndIndex((prevIndex) => prevIndex + pageSize);
    } else {
      // 마지막 페이지인 경우
      setCountNum(true);
    }
  };

  const pageNumHandler = (pageNumber) => {
    const buttonText = pageNumber.target.innerText;
    setStartIndex((buttonText - 1) * 10);
    setEndIndex(buttonText * 10);
  };

  useEffect(() => {
    fetchData();
  }, []); // 컴포넌트가 마운트될 떄 게시글 데이터를 가져온다.

  const renderPageButtons = () => {
    const startNumber = (currentPage - 1) * pageSize + 1;
    const endNumber = startNumber + pageSize - 1;
    let pageNumber;

    return Array.from({ length: totalPages }).map((_, index) => {
      if (data.length <= (startNumber + index - 1) * pageSize) {
        return;
      } else {
        pageNumber = startNumber + index;
      }
      return (
        <button
          key={pageNumber}
          className={`a num${index + 1}`}
          onClick={pageNumHandler}
        >
          {pageNumber}
        </button>
      );
    });
  };

  return (
    <>
      <board id='board'>
        <div
          className='ppps'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div id='community'>
            <h5>내가 쓴 게시글</h5>

            <div className='overlap-wrapper'>
              <div className='overlap'>
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
                      onClick={() => boarddetailhandleClick(item.boardId)}
                    >
                      <div className='text-wrapper a1'>{item.rowNumber}</div>
                      <div className='text-wrapper a3'>{item.title}</div>
                      <div className='text-wrapper a4'>{item.userName}</div>
                      <div className='text-wrappera5'>{item.regDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='PageBtn'>
            <button
              className='before'
              onClick={beforePageHandler}
            >
              <img
                src={icon1}
                alt='버튼 이미지'
                className='buttonImage'
              ></img>
            </button>
            <div className='aabtn'>
              <div className='bbbtn'>{renderPageButtons()}</div>
            </div>
            {countNum ? (
              <button>끝</button>
            ) : (
              <button
                className='after'
                onClick={afterPageHandler}
              >
                <img
                  src={icon2}
                  alt='버튼 이미지'
                  className='buttonImage'
                ></img>
              </button>
            )}
          </div>
        </div>
      </board>
      <div>
      <div className='rec_center2' onMouseLeave={handleMouseLeave}>
            MyBoard
          <div className='side2'>
            <div className='sidebar2'>
              {myboard.map((menu, index) => (
                <div
                  className='sidebar-item2'
                  key={index}
                >
                  {menu.name === '나의 나눔 게시판' ? (
                    <div
                      onMouseEnter={handleMouseEnter}
                    >
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
