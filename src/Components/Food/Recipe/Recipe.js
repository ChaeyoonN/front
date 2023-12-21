import React from 'react';
import './Recipe.scss';
import { recipe } from '../../../assets/constants';
import { NavLink } from 'react-router-dom';
import SideBarContent from '../../SideBar/SideBarContent';

const Recipe = () => {
  return (
    <div className='ContentBox'>
      {recipe.map((content, index) => {
        return (
          <NavLink
            style={{ textDecoration: 'none' }}
            to={content.path}
            key={index}
          >
            <SideBarContent content={content} />
          </NavLink>
        );
      })}
    </div>
  );
};

export default Recipe;
