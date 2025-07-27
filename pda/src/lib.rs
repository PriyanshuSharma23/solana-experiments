use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};
use solana_system_interface::instruction;

entrypoint!(process_instructions);

fn process_instructions(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    match PageVisits::try_from_slice(instruction_data) {
        Ok(page_visits) => return create_page_visits(program_id, accounts, page_visits),
        Err(_) => {}
    }

    match IncrementPageVisits::try_from_slice(instruction_data) {
        Ok(_) => return increment_page_visits(accounts),
        Err(_) => {}
    }

    Err(ProgramError::InvalidAccountData)
}

fn create_page_visits(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    page_visits: PageVisits,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let data_account = next_account_info(accounts_iter)?;
    let user_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    let account_span = borsh::to_vec(&page_visits)?.len();
    let lamports_required = Rent::get()?.minimum_balance(account_span);

    if !data_account.data_is_empty() {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    // create the account with the given data
    let ix = instruction::create_account(
        payer_account.key,
        data_account.key,
        lamports_required,
        account_span as u64,
        program_id,
    );

    invoke_signed(
        &ix,
        &[
            payer_account.clone(),
            data_account.clone(),
            system_program_account.clone(),
        ],
        &[&[
            PageVisits::SEED_PREFIX.as_bytes(),
            user_account.key.as_ref(),
            &[page_visits.bump],
        ]],
    )?;

    page_visits.serialize(&mut &mut data_account.data.borrow_mut()[..])?;

    Ok(())
}

fn increment_page_visits(accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let data_account = next_account_info(accounts_iter)?;

    let mut page_visits = PageVisits::try_from_slice(&data_account.data.borrow()[..])?;
    page_visits.increment();
    page_visits.serialize(&mut &mut data_account.data.borrow_mut()[..])?;

    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct IncrementPageVisits {}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct PageVisits {
    visits: u32,
    bump: u8,
}

impl PageVisits {
    const ACCOUNT_SPACE: usize = 8 + 32;

    const SEED_PREFIX: &'static str = "page_visits";

    fn new(visits: u32, bump: u8) -> Self {
        Self { visits, bump }
    }

    fn increment(&mut self) {
        self.visits += 1
    }
}
