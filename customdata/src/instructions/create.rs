use crate::state::address_info::AddressInfo;
use borsh::{self, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program::invoke,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};
use solana_system_interface::{instruction, program};

pub fn create_address_info(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    address_info: AddressInfo,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let address_info_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    if !payer_account.is_signer {
        return Err(solana_program::program_error::ProgramError::MissingRequiredSignature);
    }

    if system_program.key != &program::ID {
        return Err(solana_program::program_error::ProgramError::IncorrectProgramId);
    }

    let account_span = borsh::to_vec(&address_info)?.len();
    let lamports_required = Rent::get()?.minimum_balance(account_span);

    let ix = instruction::create_account(
        payer_account.key,
        address_info_account.key,
        lamports_required,
        account_span as u64,
        program_id,
    );

    let account_infos = &[
        payer_account.clone(),
        address_info_account.clone(),
        system_program.clone(),
    ];

    invoke(&ix, account_infos)?;

    address_info.serialize(&mut &mut address_info_account.data.borrow_mut()[..])?;
    Ok(())
}
