function md5hash() {
  let checkbox = document.getElementById("detailed");

  if (checkbox.checked == true) {
    console.log("Detailed view!")
  }
  let input = document.getElementById("hashInput").value;
  document.getElementById('dv1').innerHTML = input
  input = endianInv(input, 4);
  document.getElementById('dv2').innerHTML = input.join('')
  binaryval = convertTo512Chunk(input);

  //break 512 chunks into 512 bits inside an array
  let chunk512 = [];
  for (var i = 0; i < binaryval.length / 32; i++) {
    chunk512[i] = binaryval.slice(i * 32, i * 32 + 32);
  }
  console.log(chunk512);

  //document.getElementById("chunks512").innerHTML = chunk512;
  console.log(binaryval)
//initial values of A, B, C, and D.
  let objA = 1732584193
  let objB = 4023233417
  let objC = 2562383102
  let objD = 271733878
  let objFncOut = 0;
  let dv4 = "";
  //converts binary to decimal for later bitwise operations.
  for (let i = 0; i < chunk512.length; i++) {
    chunk512[i] = parseInt(chunk512[i], 2);
    if (i % 16 == 0 && i != 0) {
      dv4 += "\n\n"
    }
    if (i % 16 == 0) {
      dv4 += "Block " + i / 16 + " contains: "
    }

    dv4 += "\n[" + i % 16 + "] " + chunk512[i]

    document.getElementById('dv4').innerHTML = dv4

  }
  console.log(chunk512)

  MainLoop(objA, objB, objC, objD, objFncOut, chunk512);
  //Main loop. Does the majority of conversions within the MD5 function.
//Detailed view clauses:
  if (checkbox.checked == true) {
    console.log("Detailed view!")
    document.getElementById('detailedtable').removeAttribute("hidden")
  } else {
    console.log("Simple view!")
    document.getElementById('detailedtable').setAttribute("hidden", "")
  }
}



function endianInv(input, wrap) {
  //endian inv. inverts string from 1234567890ab to its value in little endian.
  var endianout = [];
  input = input.split('')
  //splits entered characters into 4 charcter strings eg 1234, 5678, 90ab.
  for (var i = 0; i < input.length; i += wrap) {
    endianout[Math.ceil(i / wrap)] = input.slice(i, i + wrap).join('')
  }

  // next line does a number of things.
  // Reverses order of array, eg 90ab, 5678, 1234,
  // splits into individual charactes, eg 9 0 a b 5 6 7 8 1 2 3 4,
  // joins it to 90ab56781234
  // then reverses it again to 43218765ba09.
  endianout = endianout.reverse().join('').split('').reverse()
  console.log("EndianOut " + endianout)
  return (endianout)
}


function convertTo512Chunk(input) {

  //binaryval is the 512 mutiple string representing the original text
  let binaryval = "";
  let sevenbit = "";
  let lastbyte = Math.ceil((input.length + 1) / 4) - 1

  //if string length is less than 4 characters append the 1 to the end (start) of the string
  if (lastbyte == 0 && input.length != 0) {
    binaryval += "0".repeat(8 * (3 - input.length)) + "10000000";
    lastbyte = -1
  }
  console.log("DEBUG1 " + input.length)
  //this section turns the string into whatever it is in binary
  for (let i = 0; i < input.length; i++) {
    sevenbit = input[i].charCodeAt(0).toString(2);

    //sets sevenbit to a length of 8 (padding on left)
    sevenbit = Padding(sevenbit, 8)
    console.log(binaryval)
    //appends a 1 onto the end (start) of the last byte
    if (lastbyte == i / 4) {
      console.log(i)
      binaryval += "0".repeat(8 * (i - input.length + 3)) + "10000000";
      lastbyte = -1
      console.log("AAAAAAA")
    }
    binaryval += sevenbit;

  }
  //if the length of the string is a multiple of 32 bits then append it to the end of the message in a new bit.
  if (lastbyte != -1) {
    binaryval += "0".repeat(24) + "10000000";
    lastbyte = 0
  }

  //return the length of how many bits
  let bytelength = (8 * input.length).toString(2)
  document.getElementById('dv3').innerHTML = parseInt(bytelength, 2)
  console.log("length " + bytelength)

  //adds as many zeroes to bring the string up to 64 bits short of a multiple of 512
  while ((binaryval.length % 512) != 448) {
    binaryval += "0";
  }

  //then appends a 64 bit number (the length of the original message
  bytelength = bytelength.toString(2);
  binaryval += "0".repeat(32 - bytelength.length) + bytelength + "0".repeat(32);
  console.log(binaryval.length)
  return (binaryval);
}


function SineResults(i) {
  //finds the truncated value of the absolute value of the sine of i in radians.
  i = i + 1
  return (Math.trunc(4294967296 * Math.abs(Math.sin(i))))
}


function Padding(string, length) {
  //pads strings to a desired length by prepending zeroes.
  string = "0".repeat(length - string.length) + string
  return (string)
}


function LeftAmounts(i) {
  //predetermined.
  let valuearray = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]
  return (valuearray[i])
}


function leftrotate(a, b) {
  //Function performs a bitwise shift equivalent to a<<b|a>>(32-b)
  //converts a to binary.
  a = a.toString(2)
  a = Padding(a,32)

  //appends 0's to a, which are used as a psueod left shift. This is done due to the JS Twos-complement rule.
  tempx = (a + "0".repeat(b))
  tempx = parseInt(tempx, 2) % (2 ** 32)

  //Following section performs the bitwise right shift manually to avoid the JS Twos-complement rule.
  tempy = parseInt(a.slice(0, b), 2)

  //Bitwise OR
  tempz = tempx | tempy
  //Dealing with Twos-Complement
  if (tempz < 0) {
    tempz += 2 ** 32
  }
  return (tempz)
}


function MainLoop(a, b, c, d, f, chunk512) {

  //Initialise variables.
  let dv5 = "Initial values: A= " + a + ", B= " + b + ", C= " + c + ", D= " + d;
  let g = 0;
  let objA = a
  let objB = b
  let objC = c
  let objD = d

  //First For Loop: Blocks (512 bits).
  for (let j = 0; j < 16 * Math.ceil(chunk512.length / 16); j += 16) {
    dv5 += "\nIn block [" + j / 16 + "]: Initial Values A= " + a + ", B= " + b + ", C= " + c + ", D= " + d;
    a = objA
    b = objB
    c = objC
    d = objD

    //Second For: Chunks (32 bits)
    for (var i = 0; i < 64; i++) {
      //Essentially a CASEWHERE.

      if (0 <= i && i < 16) {
        //FUNCTION F
        f = ((b & c) | (~b & d));
        g = j + i
      }


      if (16 <= i && i < 32) {
        //FUNCTION G
        f = ((b & d) | (c & (~d)))
        g = j + (5 * i + 1) % 16
      }


      if (32 <= i && i < 48) {
        //FUNCTION H
        f = (b ^ c ^ d)
        g = j + (3 * i + 5) % 16
      }


      if (48 <= i && i < 64) {
        //FUNCTION I
        f = (c ^ (b | (~d)));
        g = j + (7 * i) % 16
      }

      //Dealing with Twos Complement
      if (f < 0) {
        f += 2 ** 32
      }

      //shifts variables.
      f = (f + a + SineResults(i) + chunk512[g]) % 2 ** 32
      a = d
      d = c
      c = b
      tempb = leftrotate(f, LeftAmounts(i))
      b = (b + tempb) % 2 ** 32

      //Used for detailed view. CASEWHERE.
      switch (i % 4) {
        case 0:
          dv5 += "\nRound [" + i + "]: A= " + a + ", B= " + b + ", C= " + c + ", D= " + d
          break;
        case 1:
          dv5 += "\nRound [" + i + "]: A= " + b + ", B= " + c + ", C= " + d + ", D= " + a
          break;
        case 2:
          dv5 += "\nRound [" + i + "]: A= " + c + ", B= " + d + ", C= " + a + ", D= " + b
          break;
        case 3:
          dv5 += "\nRound [" + i + "]: A= " + d + ", B= " + a + ", C= " + b + ", D= " + c
          break;
        default:
          // code block
      }
    }

    //add to original values for next block.
    objA = (objA + a) % 2 ** 32
    objB = (objB + b) % 2 ** 32
    objC = (objC + c) % 2 ** 32
    objD = (objD + d) % 2 ** 32
    console.log("FINISHED BLOCK " + j + ". OBJA=" + objA)
  }


  //Finished at this point, just perfoming endian inverts manually.
  document.getElementById('dv5').innerHTML = dv5
  objA = Padding(objA.toString(16), 8)
  objA = objA.slice(6, 8) + objA.slice(4, 6) + objA.slice(2, 4) + objA.slice(0, 2)
  objB = Padding(objB.toString(16), 8)
  objB = objB.slice(6, 8) + objB.slice(4, 6) + objB.slice(2, 4) + objB.slice(0, 2)
  objC = Padding(objC.toString(16), 8)
  objC = objC.slice(6, 8) + objC.slice(4, 6) + objC.slice(2, 4) + objC.slice(0, 2)
  objD = Padding(objD.toString(16), 8)
  objD = objD.slice(6, 8) + objD.slice(4, 6) + objD.slice(2, 4) + objD.slice(0, 2)

  //Outputs.
  document.getElementById('dv6').innerHTML = "A= " + objA + ", B= " + objB + ", C= " + objC + ", D= " + objD
  console.log("************COMPLETE: FINAL VALUE OF HASH: " + objA + objB + objC + objD)
  document.getElementById('dv7').innerHTML = objA + objB + objC + objD
  document.getElementById('outputtext').innerHTML = "Output: "
  document.getElementById('output').innerHTML = objA + objB + objC + objD
}
