import { RuleSet } from 'model/RuleSet';
import { GameState } from 'model/GameState';
import { CardHand } from 'model/CardHand';
import {CardComparator, CardPowerComparator} from './CardComparator';
import { Card } from 'model/Card'

/**
 * カードの組み合わせが現在の状況に適用できるか（正しい組み合わせか）を検証するクラス
 */
export class CardValidator {
    private _state: GameState;      // ゲームの状態
    private _message: string = '';  // 検証時に報告したいメッセージ

    constructor(state: GameState) {
        this._state = state;
    }

    public get message(): string {
        return this._message;
    }

    /**
     * 検証する
    */
    public validate(hand: CardHand): boolean {
        var comparator = new CardPowerComparator();
        var field = this._state.field.peek();
        var handCards = this.sortCards(hand.cards);

        if (field == null){
            //親の一手目
            return true;
        }

        var fieldCards = this.sortCards(field.cards);

        if (fieldCards.length != handCards.length){
            //長さが違う場合
            return false;
        }

        if (field.cards.length == 1){
            //場のカードが一枚
            if (comparator.compare(fieldCards[1],handCards[1]) > 0){
                return true;
            }
        } else if(this.isSameNumber(fieldCards) || this.isSameNumber(handCards)){
            //場と出されたカードが同じ数字の組み合わせ
            if (comparator.compare(fieldCards[1],handCards[1]) > 0){
                return true;
            }
        } else if(this.isSequence(fieldCards) || this.isSequence(handCards)){
            //場と出されたカードが階段
            if (comparator.compare(fieldCards[1],handCards[1]) > 0){
                return true;
            }
        }
        return false;
    }

    isSameNumber(cards:Card[]):boolean{
        for (var i = 0, l = cards.length - 1 ; i < l ; i++){
            var card1 = cards[i].getCode();
            var card2 = cards[i+1].getCode();
            if (this.codeToNumber(card1) == 'J' || this.codeToNumber(card2) == 'J'){

            } else if (this.codeToNumber(card1)==this.codeToNumber(card2)){

            } else {
                return false;
            }
        }
        return true;
    }

    isSequence(cards:Card[]):boolean{
        var jokerCount = 0;
        for (var i = 0, l = cards.length; i < l; i++){
            if(this.codeToNumber(cards[i].getCode()) == 'J'){
                jokerCount++;
            }
        }
        /*
         * 階段になってるか確認
         */
        for (var i = 0, l = cards.length - 1; i < l; i++){
            if ( this.codeToNumber(cards[i+1].getCode()) == 'J'){
                break;
            }
            var card1 = parseInt(this.codeToNumber(cards[i].getCode()));
            var card2 = parseInt(this.codeToNumber(cards[i+1].getCode()));

            jokerCount = jokerCount - ((card2 - card1)-1);
            if (jokerCount < 0){
                return false;
            }
        }
        return true;
    }

    sortCards(cards:Card[]):Card[]{
        var comparator = new CardPowerComparator();
        var cardsSorted = cards.sort(function(card1,card2){
            return comparator.compare(card2,card1);
        })
        return cardsSorted;
    }

    codeToNumber(code:string):string{
        if (code.charAt(0) == 'J'){
            return 'J';
        } else {
            return code.substr(1);
        }
    }
}