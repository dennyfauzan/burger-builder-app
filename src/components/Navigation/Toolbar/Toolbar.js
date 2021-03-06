import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = (props) => (
  <header className={classes.Toolbar}>
    <DrawerToggle clicked={props.openDrawer}/>
    <Logo height="80%"/>
   
   <div className={classes.DesktopOnly}>
     <NavigationItems/>
   </div>
   
  </header>
)

export default toolbar;