
mod ll { 
    use crate::ll::List::*;

    pub enum List { 
        Cons(i32, Box<List>),
        Nil,
    }

    impl List { 
        pub fn new() -> Self { 
            Nil
        }

        pub fn prepend(self, elem: i32) -> Self {
            Cons(elem, Box::new(self))
        }

        pub fn len(&self) -> u32 { 
            match *self { 
                Cons(_, ref rem) => 1 + rem.len(),
                Nil => 0,
            }
        }

        pub fn stringify(&self) -> String { 
            match *self { 
                Cons(head, ref rem) => format!("{}, {}", head, rem.stringify()),
                Nil => format!("Nil"),
            }
        }
    }
}

fn main () {
    // Create an empty linked list
    let mut list = ll::List::new();

    // Prepend some elements
    list = list.prepend(1);
    list = list.prepend(2);
    list = list.prepend(3);

    // Show the final state of the list
    println!("linked list has length: {}", list.len());
    println!("{}", list.stringify());
}

//
// enum Stage { 
//     Beginner,
//     Advanced,
// }
//
// enum Role { 
//     Student,
//     Teacher,
// }
//
// fn main() { 
//     use crate::Stage::{ 
//         Beginner,
//         Advanced,
//     };
//
//     use crate::Role::*;
//
//     let stage = Beginner;
//     let role = Student;
//
//     match stage {
//         Beginner => println!("Beginners are starting their learning journey!"),
//         Advanced => println!("Advanced learners are mastering their subjects..."),
//     }
//
//     match role {
//         Student => println!("Students are acquiring knowledge!"),
//         Teacher => println!("Teachers are spreading knowledge!"),
//     }
// }
//
// #[allow(dead_code)]
// enum WebEvent { 
//     PageLoad,
//     PageUnload,
//     KeyPress(char),
//     Paste(String),
//     Click { x: i64, y: i64 },
// }
//
// fn inspect(event: WebEvent) {
//     match event {
//         WebEvent::PageLoad => println!("page loaded"),
//         WebEvent::PageUnload => println!("page unloaded"),
//         WebEvent::KeyPress(c) => println!("pressed '{}'.", c), 
//         WebEvent::Paste(s) => println!("pasted \"{}\".", s),
//         WebEvent::Click { x, y } => {
//             println!("clicked at x={}, y={}.", x, y);
//         },
//     }
// }
//
// fn main() {
//     let pressed = WebEvent::KeyPress('x');
//     let pasted = WebEvent::Paste("my text".to_string());
//     let click = WebEvent::Click { x: 20, y: 80 };
//     let load = WebEvent::PageLoad;
//     let unload = WebEvent::PageUnload;
//
//     inspect(pressed);
//     inspect(pasted);
//     inspect(click);
//     inspect(load);
//     inspect(unload);
// }
//
// #[allow(dead_code)]
// enum VeryVerboseEnumOfThingsToDoWithNumbers {
//     Add,
//     Subtract,
// }
//
// impl VeryVerboseEnumOfThingsToDoWithNumbers {
//     fn run(&self, x: i32, y:i32) -> i32 { 
//         match self { 
//             Self::Add => x + y,
//             Self::Subtract => x - y,
//         }
//     }
// }
//
// type Operations = VeryVerboseEnumOfThingsToDoWithNumbers;
//
//
//
// fn main() { 
//     let x = Operations::Add;
//     let result = x.run(5, 6);
//     println!("Result: {result}");
// }
