from pyteal import *

def approval_program():
    # Global state keys
    creator_key = Bytes("creator")
    total_assets_key = Bytes("total_assets")
    
    # Local state keys
    balance_prefix = Bytes("balance")
    operator_prefix = Bytes("operator")
    
    # Operations
    OP_CREATE_TOKEN = Bytes("create_token")
    OP_MINT = Bytes("mint")
    OP_BATCH_MINT = Bytes("batch_mint")
    OP_TRANSFER = Bytes("transfer")
    OP_BATCH_TRANSFER = Bytes("batch_transfer")
    OP_SET_APPROVAL = Bytes("set_approval")
    
    # Utility functions
    @Subroutine(TealType.bytes)
    def balance_key(account: Expr, token_id: Expr) -> Expr:
        return Concat(balance_prefix, account, Itob(token_id))
    
    @Subroutine(TealType.bytes)
    def operator_key(owner: Expr, operator: Expr) -> Expr:
        return Concat(operator_prefix, owner, operator)
    
    @Subroutine(TealType.uint64)
    def get_balance(account: Expr, token_id: Expr) -> Expr:
        maybe_balance = App.localGet(account, balance_key(account, token_id))
        return maybe_balance
    
    # Check if sender is creator
    is_creator = Txn.sender() == App.globalGet(creator_key)
    
    # Check if sender is approved operator
    @Subroutine(TealType.uint64)
    def is_approved_operator(owner: Expr, operator: Expr) -> Expr:
        return App.localGet(owner, operator_key(owner, operator))
    
    # Initialize contract
    on_create = Seq([
        App.globalPut(creator_key, Txn.sender()),
        App.globalPut(total_assets_key, Int(0)),
        Return(Int(1))
    ])
    
    # Create new token type
    on_create_token = Seq([
        Assert(is_creator),
        App.globalPut(total_assets_key, App.globalGet(total_assets_key) + Int(1)),
        Return(Int(1))
    ])
    
    # Mint tokens
    on_mint = Seq([
        Assert(is_creator),
        Assert(Txn.application_args.length() == Int(4)),  # op, to, token_id, amount
        App.localPut(
            Txn.accounts[1],  # to
            balance_key(Txn.accounts[1], Btoi(Txn.application_args[2])),  # token_id
            get_balance(Txn.accounts[1], Btoi(Txn.application_args[2])) + Btoi(Txn.application_args[3])  # amount
        ),
        Return(Int(1))
    ])
    
    # Transfer tokens
    on_transfer = Seq([
        Assert(Txn.application_args.length() == Int(5)),  # op, from, to, token_id, amount
        Assert(
            Or(
                Txn.sender() == Txn.accounts[1],  # from is sender
                is_approved_operator(Txn.accounts[1], Txn.sender())  # sender is approved operator
            )
        ),
        Assert(
            get_balance(Txn.accounts[1], Btoi(Txn.application_args[3])) >= Btoi(Txn.application_args[4])
        ),
        App.localPut(
            Txn.accounts[1],  # from
            balance_key(Txn.accounts[1], Btoi(Txn.application_args[3])),  # token_id
            get_balance(Txn.accounts[1], Btoi(Txn.application_args[3])) - Btoi(Txn.application_args[4])  # amount
        ),
        App.localPut(
            Txn.accounts[2],  # to
            balance_key(Txn.accounts[2], Btoi(Txn.application_args[3])),  # token_id
            get_balance(Txn.accounts[2], Btoi(Txn.application_args[3])) + Btoi(Txn.application_args[4])  # amount
        ),
        Return(Int(1))
    ])
    
    # Set approval for operator
    on_set_approval = Seq([
        Assert(Txn.application_args.length() == Int(3)),  # op, operator, approved
        App.localPut(
            Txn.sender(),
            operator_key(Txn.sender(), Txn.accounts[1]),
            Btoi(Txn.application_args[2])
        ),
        Return(Int(1))
    ])
    
    # Handle each type of operation
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(is_creator)],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(is_creator)],
        [Txn.application_args[0] == OP_CREATE_TOKEN, on_create_token],
        [Txn.application_args[0] == OP_MINT, on_mint],
        [Txn.application_args[0] == OP_TRANSFER, on_transfer],
        [Txn.application_args[0] == OP_SET_APPROVAL, on_set_approval]
    )
    
    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    with open("artifacts/erc1155_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
        f.write(compiled)
    
    with open("artifacts/erc1155_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
        f.write(compiled) 