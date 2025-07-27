/// In this module we will learn about the custom types in rust, namely enums and structs
/// Cool

#[derive(Clone, Debug)]
struct Point {
    x: f32,
    y: f32,
}

#[derive(Debug)]
struct Rectangle {
    top_left: Point,
    bottom_right: Point,
}

fn rect_area(rect: &Rectangle) -> f32 {
    let Point { x: tl_x, y: tl_y } = rect.top_left;
    let Point { x: br_x, y: br_y } = rect.bottom_right;

    return (tl_x - br_x).abs() * (br_y - tl_y).abs();
}

fn square(p: &Point, size: f32) -> Rectangle {
    let Point { x: tl_x, y: tl_y } = p;

    return Rectangle {
        top_left: p.clone(),
        bottom_right: Point {
            x: *tl_x + size,
            y: *tl_y - size,
        },
    };
}

#[derive(Debug)]
struct Person<'a> {
    name: &'a str,
    age: i32,
}

fn main() {
    let name1 = String::from("Priyanshu");
    let age1 = 23;

    let p1 = Person {
        name: &name1,
        age: age1,
    };
    println!("Person 1: {:#?}", p1);

    let p2 = Person { ..p1 };
    println!("Person 2: {:#?}", p2);
    println!("Person 1: {:#?}", p1);

    let Person {
        name: new_name,
        age: new_age,
    } = p2;

    println!(
        "Age and name after destructuring are {} and {}",
        new_age, new_name
    );
    let r = Rectangle {
        top_left: Point { x: 1.0, y: 7.0 },
        bottom_right: Point { x: 3.0, y: 4.0 },
    };

    println!("Area of the rectangle: {}", rect_area(&r));

    let sq = square(&Point { x: 1.0, y: 1.0 }, 2.0);
    println!("Square: {:#?}", sq);
    println!("Area of the square: {}", rect_area(&sq));
}
