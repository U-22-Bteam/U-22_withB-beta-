import * as SocketIO from 'socket.io';
import { Table } from '../model/Table';
import { ConnectionPlayer } from '../model/Player';
import { EventCode } from '../event/EventCode';
import { CardValidator } from '../logic/CardValidator';
import { CardHand } from '../model/CardHand';

export class TableController {
    private table: Table;
    private validator: CardValidator;

    constructor(table: Table) {
        this.table = table;
        this.validator = new CardValidator(table.state);
    }

    private onPut(player: ConnectionPlayer, codes: string[]): void {
        const hand = CardHand.fromCodes(codes);

        // 検証に失敗
        if (!this.validator.validate(hand)) {
            player.error(`エラー: ${this.validator.message}`);
            return;
        }

        // フィールドに置く
        this.table.state.field.put(hand);

        // プレイヤーのカードを捨てる
        codes.forEach(code => player.discardByCode(code));
    }

    private handleEvents(player: ConnectionPlayer) {
        const socket = player.user.socket;
        socket.on(EventCode.FieldPut, (codes: string[]) => this.onPut(player, codes));
    }

    public prepare() {
        this.table.state.players.filter(p => p instanceof ConnectionPlayer).forEach(p => {
            let player = p as ConnectionPlayer;
            this.handleEvents(player);
        });

        this.table.dealer.shuffleCards();
        this.table.dealer.dealToAllPlayers();
    }
}