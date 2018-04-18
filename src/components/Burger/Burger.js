import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from '../Burger/BurgerIngredient/BurgerIngredient';


const burger = (props) => {
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_, i) => {
          return <BurgerIngredient type={igKey} key={igKey + i}/>
        })
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

    if(transformedIngredients.length === 0 ){
      transformedIngredients = (
        <p> Please start adding ingredients! </p>
      )
    }
    

    console.log(transformedIngredients);

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top"/>
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom"/>
    </div>
  )
}

export default burger;

//Example Case to understand each burger ingredient show 
// var menu = {
//   slad: 1,
//   cheese: 2,
//   bacon: 3,
//   meet: 4
// }

// let arrMenu = Object.keys(menu);
// console.log(arrMenu);

// let arrMenuValue = arrMenu.map(igKey => {
//   return [...Array(menu[igKey])];
// })
// console.log(arrMenuValue);


// arrMenuValue.map((ig, i) => {
//   console.log(ig);
// })