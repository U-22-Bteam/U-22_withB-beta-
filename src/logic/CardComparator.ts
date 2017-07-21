import { IComparator } from 'common/Common';
import { Card } from 'model/Card';

/**
 * カード比較器のベース
 */
export abstract class CardComparator implements IComparator<Card> {
    public abstract compare(one: Card, another: Card): number;
}

export class CardPowerComparator extends CardComparator {
    /*
    * 左側が大きい場合に負の数、右側が大きい場合に正の数、等しい場合に0を返す
    */
    public compare(one: Card, another: Card){
        var card1 = one.getCode();
        var card2 = another.getCode();
        var strength1 = this.CardCodeToCardStrength(card1);
        var strength2 = this.CardCodeToCardStrength(card2);
        if (strength1 > strength2){
            return -1;
        }else if (strength1 < strength2){
            return 1;
        }else{
            return 0;
        }
    }
    /*
    * カードコードの数字部分を直接比較できるように直す
    */
    CardCodeToCardStrength(code: string){

        if (code.charAt(0) === 'J'){
            return 15;
        }

        var str:string;
        var strength:number;
        str = code.substr(1);
        strength = parseInt(str, 10);

        if (strength == 2 || strength == 1){
            strength = strength + 13;
        }
        return strength;
    }
}