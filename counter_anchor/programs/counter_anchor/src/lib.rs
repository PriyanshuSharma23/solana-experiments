use anchor_lang::prelude::*;

declare_id!("57Phdpo2EEatQZKRc6xmJDQTQTT5N4sSUzrffVaqXqfh");

#[program]
pub mod counter_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.counter.data = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>, amt: u64) -> Result<()> {
        let account = &mut ctx.accounts.counter;
        account.data = account.data.wrapping_add(amt);
        msg!(format!(
            "Incremented the value of the counter to {}",
            account.data.to_string()
        )
        .as_ref());
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>, amt: u64) -> Result<()> {
        let account = &mut ctx.accounts.counter;
        account.data = account.data.wrapping_sub(amt);
        msg!(format!(
            "Decremented the value of the counter to {}",
            account.data.to_string()
        )
        .as_ref());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=signer, space=8+8)]
    counter: Account<'info, CounterState>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    counter: Account<'info, CounterState>,
    #[account(mut)]
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    counter: Account<'info, CounterState>,
    #[account(mut)]
    signer: Signer<'info>,
}

#[account]
pub struct CounterState {
    data: u64,
}
