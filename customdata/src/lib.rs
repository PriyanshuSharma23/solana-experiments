mod instructions;
mod processor;
mod state;

use crate::processor::process_instruction;
use solana_program::entrypoint;

entrypoint!(process_instruction);
