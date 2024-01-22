import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SideBarItem from '../../SideBar/SideBarItem';
import './RecipeDetail.scss';
import { range } from 'lodash';
import { faL } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../LoadingBar/Loading';
import { food } from '../../../assets/constants';

const RecipeDetail = () => {
  const [loading, setLoading] = useState(true);

  const [pageSwitch, setPageSwitch] = useState(false);
  const location = useNavigate();

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(2); //

  const history = useNavigate();

  useEffect(() => {
    setPageSwitch(false);
    //console.log(data[0]);
    if (data[0].HASH_TAG) {
      setTagExist(true);
    }
    if (data[0].RCP_NA_TIP) {
      setTipExist(true);
    }

    setCurrentPage(1);
  }, []); // 빈 배열을 의미하는 두 번째 인자를 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 함

  const l = useLocation();
  let data = null;

  if (!!l.state) { // l.state 값이 존재하는지(참 값인지) 확인
    data = l.state.data;
  }

  if (!data) {
    location('/food/recipes');
    data = [{ MANUAL: '', RCP_PARTS_DTLS: '' }];
  }

  //////////////////////////////////////////

  // 요리방법 꺼내기
  // const steps = Array.from(
  //   new Set(
  //     Object.keys(data[0]).filter(
  //       (stepKey) => stepKey.startsWith('MANUAL') && data[0][stepKey]
  //     )
  //   )
  // ).sort((a, b) => {
  //   const aNumber = parseInt(a.slice(a.startsWith('MANUAL_IMG') ? 10 : 6), 10);
  //   const bNumber = parseInt(b.slice(b.startsWith('MANUAL_IMG') ? 10 : 6), 10);
  //   const aIsImage = a.startsWith('MANUAL_IMG');
  //   const bIsImage = b.startsWith('MANUAL_IMG');

  //   if (aIsImage && !bIsImage) {
  //     return 1;
  //   } else if (!aIsImage && bIsImage) {
  //     return -1;
  //   } else {
  //     return aNumber - bNumber;
  //   }
  // }, []);

  // 요리방법
  const steps = Array.from(
    new Set(
      Object.keys(data[0]).filter(
        (stepKey) => stepKey.startsWith('MANUAL') && data[0][stepKey]
      )
    )
  ).sort((a, b) => {
    const aNumber = parseInt(a.slice(a.startsWith('MANUAL_IMG') ? 10 : 6), 10);
    const bNumber = parseInt(b.slice(b.startsWith('MANUAL_IMG') ? 10 : 6), 10);
    const aIsImage = a.startsWith('MANUAL_IMG');
    const bIsImage = b.startsWith('MANUAL_IMG');

    if (aIsImage && !bIsImage) {
      return 1;
    } else if (!aIsImage && bIsImage) {
      return -1;
    } else {
      return aNumber - bNumber;
    }
  });
  //console.log(steps);

  // 재료
  const ingredientSep = data[0].RCP_PARTS_DTLS.split('\n');
  //console.log(ingredientSep); // ●치커리 샐러드 :~ 별 로 자름.

  // const menu = ingredientSep.map((ingre) => {
  //   return ingre.split(':'); // ["●치커리 샐러드","●올리브마늘 드레싱"]
  // });
  // const ingreByMenu = ingredientSep.map((ingre) => {
  //   return ingre.substring(ingre.indexOf(':') + 1).split(',');
  // });
  //console.log(menu); // [["치커리 30g(10줄기), ~"],["올리브유 10g(2작은술), ~"]]
  //console.log(ingreByMenu);

  //const ingredientList = data[0].RCP_PARTS_DTLS.split(', ');

  let stepsText = steps.filter((stepKey) => !stepKey.startsWith('MANUAL_IMG'));
  stepsText = ['x', 'x', ...stepsText];
  console.log(stepsText);

  //const [perPage, setPerPage] = useState(3); // 한 페이지에 보여줄 요리방법 수
  // 다음 페이지로 이동하는 함수
  const handleClickNext = () => {
    setCurrentPage((prevPage) => {
      const curpage = prevPage + 1;
      setPageSwitch(true);

      return curpage;
    });
  };

  // 이전 페이지로 이동하는 함수
  const handleClickPrev = () => {
    setCurrentPage((prevPage) => {
      const curpage = prevPage - 1;

      console.log('handleClickPrev', curpage);
      if (curpage === 1) {
        setPageSwitch(false);
      } else {
        setPageSwitch(true);
      }

      return curpage;
    });
  };

  const [tagExist, setTagExist] = useState(false);
  const [tipExist, setTipExist] = useState(false);

  const [selectedCate, setSelectedCate] = useState('');
  const [dataMenu, setDataMenu] = useState();
  const [pageNum, setPageNum] = useState(1);
  // const menus = [
  //   { id: 1, name: ' 레시피' },
  //   { id: 2, name: ' 혼밥하기 좋은 맛집' },
  // ];
  const menus = food;
  //SidebarItem 클릭 시 처리할 함수
  const onMenuClick = (props) => {
    // console.log('자식놈한테 데이터 받아올 함수!');
    console.log('자식놈한테 받은 데이타: ', props);
    console.log('카테고리 세팅: ', props.COOKRCP01.row[0].RCP_PAT2);
    setSelectedCate(props.COOKRCP01.row[0].RCP_PAT2);

    setDataMenu(props);
  };

  // const stepsImage = steps.filter((stepKey) =>
  //   stepKey.startsWith('MANUAL_IMG')
  // );

  const totalPages = Math.ceil(stepsText.length / itemsPerPage) - 1;

  let startIndex = currentPage - 1; // 현재 페이지의 시작 인덱스
  startIndex = currentPage < 2 ? startIndex : (currentPage - 2) * 4 + 2;
  //let endIndex = startIndex + itemsPerPage; // 현재 페이지의 끝 인덱스

  const currentItems = stepsText.slice(startIndex, startIndex + 2); // 왼쪽 페이지에 보여줄 요리방법들
  const currentItems2 = stepsText.slice(startIndex + 2, startIndex + 4); // 오른쪽 페이지에 보여줄 요리방법들

  const Page1 = () => (
    <div
      className='recipe-page__left'
      style={{ width: '700px', height: '850px' }}
    >
      <img
        className='recipe-page__image'
        src={data[0].ATT_FILE_NO_MAIN}
        alt='레시피 사진'
      />
      <h2 className='recipe-page__title'>{data[0].RCP_NM}</h2>
      {tagExist && <p className='recipe-page__tag'>#{data[0].HASH_TAG}</p>}
      <p className='recipe-page__way'>조리방법: {data[0].RCP_WAY2}</p>
      {tipExist && (
        <p className='recipe-page__tip'>저감조리법 TIP: {data[0].RCP_NA_TIP}</p>
      )}
      {currentPage > 1 && (
        <div className='pagination-buttons prev'>
          <a onClick={handleClickPrev}>이전 페이지</a>
        </div>
      )}
    </div>
  );

  const Page2 = () => (
    <div
      className='recipe-page__right'
      style={{ width: '700px', height: '850px' }}
    >
      <div className='recipe-page__section'>
        <h3 className='recipe-page__section-title'>재료</h3>
        <ul className='recipe-page__ingredient-list'>
          {ingredientSep.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className='recipe-page__section'>
        <h3 className='recipe-page__section-title'>영양소</h3>
        <li className='li'>탄수화물: {data[0].INFO_CAR}</li>
        <li className='li'>단백질: {data[0].INFO_PRO}</li>
        <li className='li'>지방: {data[0].INFO_FAT}</li>
        <li className='li'>나트륨: {data[0].INFO_NA}</li>
      </div>
      <div className='recipe-page__section'>
        <h3 className='recipe-page__section-title'>칼로리</h3>
        <li className='li'>{data[0].INFO_ENG}(Kcal)</li>
      </div>
      {currentPage < totalPages && (
        <div className='pagination-buttons next'>
          <a onClick={handleClickNext}>다음 페이지</a>
        </div>
      )}
    </div>
  );

  const Page3 = () => (
    <div
      className='recipe-page__left'
      style={{ width: '700px', height: '850px' }}
    >
      <div className='recipe-page__section2'>
        <h3 className='recipe-page__section-title2'></h3>
        <ol className='recipe-page__instructions2'>
          {currentItems.map((stepKey, index) => {
            const stepId = `step_${index + 1}`;
            // console.log(stepId);
            // const stepNumber = index + 1;
            console.log('stepKey', stepKey);

            const stepNumber = parseInt(
              stepKey.slice(stepKey.startsWith('MANUAL_IMG') ? 10 : 6),
              10
            );
            const imageKey = `MANUAL_IMG${stepNumber
              .toString()
              .padStart(2, '0')}`;
            const imageUrl = data[0][imageKey];

            return (
              <div key={stepKey}>
                {data[0][stepKey] !== imageUrl && <h3>{data[0][stepKey]}</h3>}
                <div>
                  {imageUrl && (
                    <img
                      className='recipe-page__image_way'
                      src={imageUrl}
                      alt={`Step ${stepNumber}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </ol>
      </div>
      {currentPage > 1 && (
        <div className='pagination-buttons prev'>
          <a onClick={handleClickPrev}>이전 페이지</a>
        </div>
      )}
    </div>
  );

  const Page4 = () => (
    <div
      className='recipe-page__right'
      style={{ width: '700px', height: '850px' }}
    >
      <div className='recipe-page__section2'>
        <h3 className='recipe-page__section-title2'></h3>
        <ol className='recipe-page__instructions2'>
          {currentItems2.map((stepKey, index) => {
            const stepId = `step_${index + 1}`;
            // console.log(stepId);
            // const stepNumber = index + 1;
            const stepNumber = parseInt(
              stepKey.slice(stepKey.startsWith('MANUAL_IMG') ? 10 : 6),
              10
            );
            const imageKey = `MANUAL_IMG${stepNumber
              .toString()
              .padStart(2, '0')}`;
            const imageUrl = data[0][imageKey];

            return (
              <div key={stepKey}>
                {data[0][stepKey] !== imageUrl && <h3>{data[0][stepKey]}</h3>}
                <div>
                  {imageUrl && (
                    <img
                      className='recipe-page__image_way'
                      src={imageUrl}
                      alt={`Step ${stepNumber}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </ol>
      </div>

      {currentPage < totalPages && (
        <div className='pagination-buttons next'>
          <a onClick={handleClickNext}>다음 페이지</a>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className='warp-side'>
        <div>
          <div className='rec_center'>
            <div>FOOD</div>
            <div className='side'>
              <div className='sidebar'>
                {menus.map((menu, index) => {
                  return (
                    <NavLink
                      style={{ textDecoration: 'none' }}
                      to={menu.path}
                      key={index}
                    >
                      <SideBarItem
                        menu={menu}
                        onMenuClick={onMenuClick}
                        pageNum={pageNum}
                      />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {!pageSwitch && (
          <>
            <div className='btnDiv'>
            <button
              onClick={() => {
                history(-1);
              }}
            >
              뒤로가기
            </button>
          </div>
            <div className='recipe-page'>
              
              <Page1 />
              <Page2 />
            </div>
          </>
        )}
        {pageSwitch && (
          <>
            <div className='btnDiv'>
            <button
              onClick={() => {
                history(-1);
              }}
            >
              뒤로가기
            </button>
          </div>
            <div className='recipe-page'>
              
              <Page3 />
              <Page4 />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RecipeDetail;
