import React, { Component } from 'react';
import styles from './App.css';
import fetch from 'node-fetch';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured_card: {},
      lands: [],
      spells: [],
      creatures: [],
      sideboard: []
    }
  }

  loadDeckFromServer(deckId) {

    console.log(this.props);

    const query = `http://api.fateseal.com/?query=%7B%0A%20%20deck(id%3A%22${deckId}%22)%20%7B%0A%20%20%20%20featured_card%20%7B%0A%20%20%20%20%20%20url%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20cards%20%7B%0A%20%20%20%20%20%20quantity%0A%20%20%20%20%20%20board%0A%20%20%20%20%20%20card_id%20%7B%0A%20%20%20%20%20%20%20%20url%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20type%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D`;

    fetch(query)
    .then((res) => res.json())
    .then((json) => this.setState({
      featured_card: json.data.deck.featured_card,
      lands: json.data.deck.cards.reduce((array, card) => card.board.match('mainboard', 'i') && card.card_id.type.match('Land', 'i') ? [...array, ...Array(card.quantity).fill(card.card_id.url)] : array),
      creatures: json.data.deck.cards.reduce((array, card) => card.board.match('mainboard', 'i') && card.card_id.type.match('Creature', 'i') && !card.card_id.type.match('Land', 'i') ? [...array, ...Array(card.quantity).fill(card.card_id.url)] : array),
      spells: json.data.deck.cards.reduce((array, card) => card.board.match('mainboard', 'i') && !card.card_id.type.match('Creature', 'i') && !card.card_id.type.match('Land', 'i') ? [...array, ...Array(card.quantity).fill(card.card_id.url)] : array),
      sideboard: json.data.deck.cards.reduce((array, card) => card.board.match('sideboard', 'i') ? [...array, ...Array(card.quantity).fill(card.card_id.url)] : array),
    }))
    .catch((err) => console.error(err))
  }

  componentDidMount() {
    this.loadDeckFromServer("59109422750ac100113fb245")
  }

  render() {
    const { featured_card, lands, spells, creatures, sideboard } = this.state;
    return (
      <div
        className={styles.wrapper}
      >
        <div
          className={styles.overlay}
        >
          <div
            style={{
              backgroundImage: `url(${this.state.featured_card.url})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '200%',
              height: '200%',
              marginLeft: '-50%',
              marginTop: '-10%',
              position: 'relative',
              overflow: 'hidden'
            }}
            >
            <div
              className={styles.backgroundOverlay}
              >
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'relative'
          }}
        >
          <Column cards={lands} title='Lands'/>
          <Column cards={creatures} title='Creatures'/>
          <Column cards={spells} title='Spell'/>
          <Column cards={sideboard} offset={true} title='Sideboard'/>
        </div>
        <p>test</p>
      </div>
    );
  }
}

const Column = ({ cards, offset = false, title }) => (
    <ul className={styles.column}>
      <h3>{title} ({cards.length})</h3>
      {
        cards.map((card, i) => (
          <li
            style={{
              height: 25
            }}
            >
              <img
                src={card}
                style={{
                  width: 150,
                  marginLeft: i%2==1 && offset ? 30 : 0
                }}
              />
            </li>
          ))
        }
    </ul>
)
