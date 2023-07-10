import React from "react";
import './user-profile.css';
import {trans} from '../general_';

export default function UserProfileDropdown({translation, userInfo, setUserInfo, addMessage, on_user_logout_click}){
  return (
    <div className="dropdown dropdown-right">
      <span href="#" className="btn btn-link dropdown-toggle" tabIndex="0">
      {trans("Me", translation)} <i className="icon icon-caret"></i>
      </span>
      <ul className="menu profile-menu"><form>
        <li class="divider text-left" data-content={trans("Profile", translation)}></li>
        <li className="menu-item">
            <div className="tile tile-centered">
              <div className="tile-icon"><img className="avatar" src="../img/avatar-4.png" alt="Avatar"/></div>
              <div className="tile-content text-right">{userInfo.username}</div>
            </div>
        </li>
        <li className="menu-item">
            <div className="tile tile-centered" onClick={on_user_logout_click}>
              <div className="tile-content text-right">{trans("Logout", translation)}</div>
              <div className="tile-action">
              <i className="icon icon-arrow-left"></i>
              </div>
            </div>
        </li>

      </form></ul>
    </div>
  )
}