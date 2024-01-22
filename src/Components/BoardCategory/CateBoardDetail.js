import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL, CATEGORYBOARD } from '../../config/host-config';
import { Refresh } from '@mui/icons-material';
import CategoryBoardDetailItem from './CategoryBoardDetailItem';
import { board } from '../../assets/constants';
import OneLifeSideBarItem from './OneLifeSideBarItem';
import './CateBoardDetail.scss';
import { comment } from 'stylis';
// import { Button } from 'bootstrap';
import { Button } from 'reactstrap';

const CateBoardDetail = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [regDate, setRegDate] = useState([]);
  const QUESTION_URL = API_BASE_URL + CATEGORYBOARD;
  const [refresh, setRefresh] = useState(false);
  const [comment, setComment] = useState([]);
  const [commentmody, setCommentMody] = useState(false);
  const redirection = useNavigate();

  const userName = localStorage.getItem('LOGIN_USERNAME');

  const yourData = location.state?.board;

  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언
    Authorization: 'Bearer ' + localStorage.getItem('LOGIN_TOKEN'),
  };

  const { boardId, category } = location.state || {};

  const Boarddetailhandler = async () => {
    try {
      const res = await fetch(QUESTION_URL + '/' + category + '/' + boardId, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });

      const result = await res.json();

      if (result) {
        // 데이터를 상태에 업데이트

        setData(result);
        setRegDate(new Date(result.regDate).toISOString().split('T')[0]);
      } else {
        console.log('No data received from the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    Boarddetailhandler();
    fetchCategoryCommentData();
  }, [refresh]);

  const fetchCategoryCommentData = async () => {
    try {
      const responseComment = await fetch(
        QUESTION_URL + '/' + category + '/' + boardId + '/reply',
        {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
        }
      );
      const resultComment = await responseComment.json();

      if (resultComment.length > 0) {
        const CommentData = resultComment.map((item) => ({
          boardId: item.boardId,
          commentId: item.commentId,
          content: item.content,
          regDate: new Date(item.regDate).toISOString().split('T')[0],
          userId: item.userId.slice(0, 4),
          userName: item.userName,
        }));

        // 데이터를 상태에 업데이트

        setComment(CommentData);
      } else {
        setComment([]);
        console.log('No data received from the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setCommentMody(true);
    }
  };

  const commentaddhandle = async () => {
    const value = document.getElementsByClassName('comment')[0].value;

    if (value === '') {
      alert('내용을 입력하세요');
      return;
    }
    const commentAdd = await fetch(QUESTION_URL + '/' + boardId + '/reply', {
      method: 'POST', // 또는 'PUT'에 따라 사용하고자 하는 HTTP 메서드 선택
      headers: requestHeader,
      body: JSON.stringify(value),
    });
    document.getElementsByClassName('comment')[0].value = '';

    setRefresh(!refresh);
  };

  const onelifeDelHandler = async (id, category) => {
    const BoardDel = fetch(QUESTION_URL + '/' + category + '/' + id, {
      method: 'DELETE',
      headers: requestHeader,
    });

    setRefresh(!refresh);
    // window.history.back();
    alert('삭제되었습니다');
    redirection('/board/onelife');
  };

  const oneLifeChangeBoardHandler = async (id, category) => {
    const titleAddElement =
      document.getElementsByClassName('text-wrappera901')[0];
    const contentAddElement =
      document.getElementsByClassName('text-wrappera902')[0];
    const titleAdd = titleAddElement ? titleAddElement.value : '';
    const contentAdd = contentAddElement ? contentAddElement.value : '';
    if (!titleAdd || !contentAdd) {
      alert('제목과 내용을 모두 입력해주세요.');
      return; // 요청을 보내지 않고 함수를 종료
    } else {
      const BoardChange = await fetch(
        QUESTION_URL + '/' + category + '/' + id,
        {
          method: 'PUT', // 또는 'PUT'에 따라 사용하고자 하는 HTTP 메서드 선택
          headers: requestHeader,
          body: JSON.stringify({
            title: titleAdd, // 이 부분에서 직접 사용
            content: contentAdd, // 이 부분에서 직접 사용
            category: category,
          }),
        }
      );
    }
    setCommentMody(!commentmody);
    setRefresh(!refresh);
  };

  return (
    <>
      {/* <board id='board1'> */}
      <div className='App_wrap-content__1j7ZVa'>
        <div className='rec_center2c'>
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
                      fetchCategoryCommentData={fetchCategoryCommentData}
                    />
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
        <div className='overlapoc'>
          {userName === data.userName ? (
            <div>
              <div className='text-wrapperaaa'>
                <div className='aaa'>
                  <div className='text-wrappera4'>
                    {data.userName}
                  </div>
                  <div className='text-wrappera5'>{regDate}</div>
                </div>
                <div className='iiip'>
                  {/* <button
                    className='text-wrappera20'
                    onClick={() => setCommentMody(!commentmody)}
                  >
                    <span>수정</span>
                  </button> */}
                  <button
                    type='button'
                    class='btn btn-primary'
                    // className='text-wrappera20'
                    onClick={() => setCommentMody(!commentmody)}
                  >
                    수정
                  </button>
                  <button
                    type='button'
                    class='btn btn-danger'
                    // className='text-wrappera30'
                    onClick={(e) => onelifeDelHandler(data.id, data.category)}
                  >
                    삭제
                  </button>
                </div>
                {commentmody ? (
                  <>
                    <div className='OOOa'>
                      <div className='lll'>
                        <input
                          type='text'
                          placeholder={data.title}
                          className='text-wrappera901'
                        />

                        <input
                          type='text'
                          placeholder={data.content}
                          className='text-wrappera902'
                        />
                      </div>
                      <div>
                        <button
                          className='text-wrappera22'
                          onClick={() =>
                            oneLifeChangeBoardHandler(data.id, data.category)
                          }
                        >
                          등록
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='text-wrappera2'>{data.title}</div>
                    <div className='text-wrappera3'>{data.content}</div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className='content-text-wrapperaaNo'>
              <div className='aa'>
                <div className='text-wrappera4'>
                  {data && data.userName && data.userName}
                </div>
                <div className='text-wrappera5'>{regDate}</div>
              </div>
              <div className='text-wrappera2'>{data.title}</div>
              <div className='text-wrappera3'>{data.content}</div>
            </div>
          )}

          {/* <div className='aaaaaaa'></div> */}

          <div className='content-text-wrapper00'>
            <input
              type='text'
              placeholder='댓글을 입력하세요'
              className='comment'
            />
            {/* <button
              type='button'
              class='btn btn-primary'
              data-bs-toggle='button'
              className='commentadd'
              onClick={commentaddhandle}
            >
              클릭
            </button> */}
            {/* <button
              type='button'
              class='btn btn-outline-primary'
              onClick={commentaddhandle}
            >
              Click
            </button> */}
            <Button
              // active
              color='info'
              outline
              size='lg'
              className='commentadd'
              onClick={commentaddhandle}
            >
              click
            </Button>
          </div>

          {comment.map((item) => (
            <CategoryBoardDetailItem
              item={item}
              fetchCategoryCommentData={fetchCategoryCommentData}
              category={category}
            />
          ))}
        </div>
      </div>
      {/* </board> */}
    </>
  );
};
export default CateBoardDetail;
