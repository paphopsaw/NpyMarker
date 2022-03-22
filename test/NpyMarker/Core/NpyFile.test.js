import NpyFile from "NpyMarker/Core/NpyFile";

function shapeEqual(shape1, shape2) {
    if (shape1 === shape2) return true;
    if (shape1 == null || shape2 == null) return false;
    if (shape1.length !== shape2.length) return false;

    for (let i = 0; i < shape1.length; i++) {
        if (shape1[i] !== shape2[i]) return false;
    }
    return true
}

test("Test parseHeader 1", () => {
    const file = new NpyFile();
    file.parseHeader("{'descr': '<i8', 'fortran_order': False, 'shape': (3, 3), }");
    expect(file.descr).toBe("<i8");
    expect(file.fortranOrder).toBe(false);
    expect(shapeEqual(file.shape, [3,3])).toBe(true);
})

test("Test parseHeader 2", () => {
    const file = new NpyFile();
    file.parseHeader("{'descr' : '<f8', 'fortran_order':  True, 'shape': (3, 3, 6), }");
    expect(file.descr).toBe("<f8");
    expect(file.fortranOrder).toBe(true);
    expect(shapeEqual(file.shape, [3,3,6])).toBe(true);
})

test("Test parseHeader 3", () => {
    const file = new NpyFile();
    file.parseHeader("{'fortran_order':  True, 'descr' : '<f8', 'shape': (3, 3, 6), }");
    expect(file.descr).toBe("<f8");
    expect(file.fortranOrder).toBe(true);
    expect(shapeEqual(file.shape, [3,3,6])).toBe(true);
})