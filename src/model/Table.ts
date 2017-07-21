import { MainServer } from 'server/MainServer';
import { RuleSet } from './RuleSet';
import { Dealer } from './Dealer';
import { Player } from './Player';
import { GameState } from './GameState';
import { ConnectionField } from './Field';

/**
 * テーブル
 */
export class Table {
    readonly server: MainServer;    // サーバー
    readonly dealer: Dealer;     // ディーラー
    readonly state: GameState;   // ゲームの状態

    constructor(server: MainServer, rules: RuleSet, players: Player[]) {
        this.server = server;
        this.dealer = new Dealer(rules, players);
        this.state = new GameState(players, rules, new ConnectionField(server));
    }
}