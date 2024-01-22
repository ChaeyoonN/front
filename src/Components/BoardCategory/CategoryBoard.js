import React, { useEffect, useState } from 'react';
import { board } from '../../assets/constants';
import { NavLink, useNavigate } from 'react-router-dom';
import { API_BASE_URL, CATEGORYBOARD } from '../../config/host-config';
// import SideBarItem from './OneLifeSideBarItem.js';
import SideBarItem2 from '../SideBar/SideBar2/SideBarItem2.js';
import OneLifeSideBarItem from './OneLifeSideBarItem.js';
import './CategoryBoard.scss';
import CateBoardDetail from './CateBoardDetail.js';
import icon3 from '../../assets/img/icon1.png';
import icon4 from '../../assets/img/icon2.png';

const CategoryBoard = () => {
  const redirection = useNavigate();
  const [data, setData] = useState([]);
  const QUESTION_URL = API_BASE_URL + CATEGORYBOARD;
  const [refresh, setRefresh] = useState(false);
  const [controller, setController] = useState(false);

  const [countNum, setCountNum] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const itemsPerPage = 5;

  // 로그인 인증 토큰
  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언
    Authorization: 'Bearer ' + localStorage.getItem('LOGIN_TOKEN'),
  };

  //   카테고리 별 게시글 가져오기
  const fetchDataHandler = async (category, AddCate) => {
    try {
      const res = await fetch(QUESTION_URL + '/' + category);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();

      if (result.length > 0) {
        const processedData = result.map((item) => ({
          rowNum: item.rowNumber,
          id: item.boardId,
          category: item.category,
          title: item.title,
          regDate: new Date(item.regDate).toISOString().split('T')[0],
          userId: item.userId,
          userName: item.userName,
        }));
        if (AddCate === 0) {
          const vvv = processedData[processedData.length - 1].rowNum - 1;
          const naa = Math.floor(vvv / 10) * 10;
          const pageIndex = processedData.length / 50; // 51번째 데이터가 속한 페이지
          setStartIndex(naa);
          setEndIndex(naa + 10);
          renderPageButtons();
          setCurrentPage(Math.ceil(pageIndex));
        } else {
          setCurrentPage(1);
          setStartIndex(0);
          setEndIndex(10);
        }

        // 데이터를 상태에 업데이트
        setData(processedData);
        // setRefresh(!refresh);
      } else {
        setData([]);
        console.log('No data received from the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // 게시물 추가
  const CategoryAddBoardHandler = async () => {
    // console.log(setStartIndex, setEndIndex);
    // setStartIndex(0);
    // setEndIndex(10);
    const categoryinputAddElement =
      document.getElementById('categoryChoice').value;
    const titleAddElement = document.getElementsByClassName('title')[0];
    const contentAddElement = document.getElementsByClassName('content')[0];
    const categoryAdd = categoryinputAddElement ? titleAddElement.value : '';
    const titleAdd = titleAddElement ? titleAddElement.value : '';
    const contentAdd = contentAddElement ? contentAddElement.value : '';
    const AddCate = 0;

    titleAddElement.value = '';
    contentAddElement.value = '';

    // console.log(categoryinputAddElement);

    if (!titleAdd || !contentAdd || !categoryAdd) {
      alert('모두 입력해주세요.');
      return; // 요청을 보내지 않고 함수를 종료
    }

    if (!localStorage.getItem('LOGIN_TOKEN')) {
      alert('로그인 후 이용해주세요');
      return;
    }

    const BoardAdd = await fetch(QUESTION_URL + '/' + categoryAdd, {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        category: categoryinputAddElement,
        title: titleAdd, //
        content: contentAdd,
      }),
    });
    fetchDataHandler(categoryinputAddElement, AddCate);
    // setRefresh(!refresh);
  };

  useEffect(() => {
    fetchDataHandler('entire');
  }, [refresh]);

  // 상세보기 요청
  const oneBoarddetailhandler = (boardId, category) => {
    // 선택된 아이템에 대한 로직을 수행
    redirection('/board/onelife/detail', {
      state: { boardId: boardId, category: category },
    });
  };

  const controllOneHandler = (name) => {
    if (name === '카테고리 게시판') {
      // console.log('aaaaaaaa 카테고리 게시판');
      setController(true);
    }
  };

  const beforePageHandler = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    // setStartIndex(startIndex - 10);
    // setEndIndex(endIndex - 10);
    setCountNum(false);
  };

  const afterPageHandler = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const pageNumHandler = (pageNumber) => {
    const buttonText = pageNumber.target.innerText;
    setStartIndex((buttonText - 1) * 10);
    setEndIndex(buttonText * 10);
  };

  const renderPageButtons = () => {
    const startNumber = (currentPage - 1) * itemsPerPage + 1;
    const endNumber = startNumber + itemsPerPage - 1;
    let pageNumber;

    return Array.from({ length: itemsPerPage }).map((_, index) => {
      if (data.length <= (startNumber + index - 1) * 10) {
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
      <board id='qna-board'>
        <div className='App_wrap-content__1j7ZVa'>
          <div className='rec_center2'>
            Community
            <div className='side2'>
              <div className='sidebar2'>
                {board.map((menu, index) => {
                  return (
                    <NavLink
                      style={{ textDecoration: 'none' }}
                      to={menu.path}
                      key={index}
                    >
                      <OneLifeSideBarItem
                        menu={menu}
                        fetchDataHandler={fetchDataHandler}
                      />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='ppps-qna'>
            <div id='community'>
              {/* <h5>OneLife 게시판</h5> */}

              <div className='overlap-wrapper'>
                <div className='overlap'>
                  <div className='content-text-wrapper'>
                    <div className='text-wrapper a1'>No</div>
                    {/* <div className='text-wrapper a2'>게시판</div> */}
                    <div className='text-wrapper a2'>카테고리</div>
                    <div className='text-wrapper a3'>제목</div>
                    <div className='text-wrapper a4'>글쓴이</div>
                    <div className='text-wrapper a5'>작성일자</div>
                  </div>
                  <div className='createBoard'>
                    <div className='createBoardAA'>
                      <div className='kpp'>
                        {/* <select
                          
                          name='category'
                        >
                          <option value='entire'>전체</option>
                        </select> */}
                        <select
                          id='categoryChoice'
                          class='form-select form-select-sm'
                          aria-label='.form-select-sm example'
                        >
                          <option value='recipe'>레시피</option>
                          <option value='dwelling'>주거</option>
                          <option value='life'>라이프</option>
                          <option value='Policy'>정책</option>
                          <option value='trade'>중고거래</option>
                        </select>
                        <input
                          type='text'
                          placeholder='제목을 입력하세요'
                          className='title'
                        />
                      </div>
                      <input
                        type='text'
                        placeholder='내용을 입력하세요'
                        className='content'
                      />
                    </div>
                    <div className='createBoardB'>
                      <button
                        onClick={CategoryAddBoardHandler}
                        className='btnBoard'
                      >
                        등록
                      </button>
                    </div>
                  </div>

                  <div className='overlap-group1'>
                    {data.slice(startIndex, endIndex).map((item) => (
                      <div
                        key={item.boardId}
                        className='content-text-wrapper1'
                        onClick={() =>
                          oneBoarddetailhandler(item.id, item.category)
                        }
                      >
                        <div className='text-wrappera1f'>{item.rowNum}</div>
                        <div className='text-wrappera2f'>{item.category}</div>
                        <div className='text-wrappera3f'>{item.title}</div>
                        <div className='text-wrappera4f'>
                          {item.userName}
                        </div>
                        <div className='text-wrappera5f'>{item.regDate}</div>
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
                  src={icon3}
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
                    src={icon4}
                    alt='버튼 이미지'
                    className='buttonImage'
                  ></img>
                </button>
              )}
            </div>
          </div>
          {/* <CateBoardDetail fetchDataHandler={fetchDataHandler} /> */}
        </div>
      </board>
    </>
  );
};

export default CategoryBoard;
