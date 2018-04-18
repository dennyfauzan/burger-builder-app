import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENTS_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  // constructor(props){
  //   super(props);
  //   this.state = {...}
  // }

  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount(){
    axios.get('/ingredients.json')
    .then(response => {
      this.setState({
        ingredients: response.data
      })
    })
    .catch( err => {
      this.setState({ error : true})
      console.log('error request')
    })
  }
  
  updatePurchaseState(ingredients){
    
    // create an array of keys object
    const sum = Object.keys(ingredients)
      .map( igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el
      } , 0)

      //setState if sum > 0
      this.setState({purchaseable: sum > 0 });
  }

  addIngridientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;

    //update price
    const priceAddition = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingredients : updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0 ){
      return
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;

    //update price
    const priceDeduction = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
      totalPrice: newPrice,
      ingredients : updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients)
  }

  purchaseHandler = () => {
    this.setState({ purchasing : true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing : false });
  }

  purchaseContinueHandler = () => {
    //alert('You continue!');
    this.setState({ loading : true })
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Fajar Dirgantara',
        address: {
          street: 'Jl Rawa Belong Raya No 21',
          zipCode: 232323,
          country: 'Japan'
        },
        email: 'Denn@mail.com',
        deliveryMethod: 'fastest'
      }

    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false, purchasing: false });
      })
      .catch( error => {
        this.setState({loading: false, purchasing: false });
      })

  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    //Add Logic if loading happend or connection slow will make spinner append
    let orderSummary = null;

  
    //render component before response back from database
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>
    if(this.state.ingredients){
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls
            ingredientAdded={this.addIngridientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}
            purchaseable={this.state.purchaseable}/>
        </Aux>
      )

      orderSummary = <OrderSummary 
      ingredients={this.state.ingredients}
      purchaseCancelled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler}
      price={this.state.totalPrice}/>
      
      if(this.state.loading){
        orderSummary = <Spinner/>
      }

    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios);