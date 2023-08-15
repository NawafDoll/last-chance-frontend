import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FUNDING, PayPalButtons } from "@paypal/react-paypal-js";
import { UserContext } from "../components/ContextUser";
import { CalendarIcon } from "@chakra-ui/icons";
import PurchaseConfirm from "../components/PurchaseConfirm";
interface dataEvent {
  _id: string;
  eventName: string;
  image: string;
  price: number;
  date: string;
  time: number;
  placeEvent: string;
  imageSeats: string;
}
interface dataTicket {
  _id: string;
  price: any;
  category: string;
  seat: string;
  user_id: string;
  event_id: string;
}
function PayPage() {
  const { userInfo } = UserContext();
  const { _id } = useParams();
  const [infoTicket, setInfoTicket] = useState<dataTicket>({
    _id: "",
    price: "",
    category: "",
    seat: "",
    user_id: "",
    event_id: "",
  });
  const [infoEvent, setInfoEvent] = useState<dataEvent>({
    _id: "",
    eventName: "",
    image: "",
    price: 0,
    date: "",
    time: 0,
    placeEvent: "",
    imageSeats: "",
  });
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  useEffect(() => {
    axios
      .get(`http://localhost:3336/ticket/ticketinfo/${_id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log(res.data);
        const data = res.data;
        setInfoTicket(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [_id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3336/event/${infoTicket.event_id}`)
      .then((res) => {
        setInfoEvent(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [infoTicket.event_id]);
  const createOrder = (data: any) => {
    // Order is created on the server and the order id is returned
    return fetch(`http://localhost:3336/order/createOrder/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({
        product: {
          price: infoTicket.price,
        },
      }),
    })
      .then((response) => {
        if (response.status === 400 && response.status < 500) {
          return toast({
            title: "نعتذر منك تم شراء التذكرة من قبل مستخدم اخر",
            status: "warning",
            position: "bottom",
            colorScheme: "pink",
            isClosable: true,
          });
        }
        return response.json();
      })
      .then((order: any) => order.id)
      .catch((err) => {
        console.log(err);
        toast({
          title: "حدث الصفحة او قم بأعادة تسجيل الدخول",
          status: "warning",
          position: "bottom-left",
          colorScheme: "pink",
          isClosable: true,
        });
      });
  };
  const onApprove = async (data: any) => {
    // Order is captured on the server and the response is returned to the browser
    try {
      const response = await fetch(
        `http://localhost:3336/order/captuerOrder/${_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            orderID: data.orderID,
            price: infoTicket.price,
            ticket_id: infoTicket._id,
            userBuy_id: userInfo.id,
            userSell_id: infoTicket.user_id,
            category: infoTicket.category,
            seat: infoTicket.seat,
          }),
        }
      );
      if (response.status >= 400 && response.status < 500) {
        window.close();
        // return alert("للأسف تم شراء التذكرة من قبل مستخ");
        toast({
          title: "نعتذر منك تم شراء التذكرة من قبل مستخدم اخر",
          status: "warning",
          position: "bottom",
          colorScheme: "pink",
          isClosable: true,
        });
      }
      await axios.put(`http://localhost:3336/ticket/purchase/${_id}`);

      onOpen();
      setTimeout(() => {
        onClose();
      }, 5000);

      return await response.json();
    } catch (err) {
      toast({
        title: "حدث الصفحة او قم بأعادة تسجيل الدخول",
        status: "warning",
        position: "bottom-left",
        colorScheme: "pink",
        isClosable: true,
      });
    }
  };
  const onError = (error: any) => {
    // عرض الخطأ الذي حدث
    console.log(error);
    window.close();
  };

  return (
    <Box backgroundColor={"#12132c"} color={"lavender"} minH={"90.2vh"}>
      <Heading textAlign={"right"} padding={"10px"}>
        تفاصيل الدفع
      </Heading>
      <HStack
        justifyContent={"space-evenly"}
        mt={"10px"}
        marginBottom={"10px"}
        flexWrap={"wrap"}
        alignItems={"flex-start"}
      >
        <Box
          m={"5px"}
          width={"500px"}
          border={"1px"}
          borderColor={"gray"}
          borderTopLeftRadius={"3xl"}
          borderTopRightRadius={"3xl"}
        >
          <VStack>
            <Image
              src={infoEvent.image}
              w={"full"}
              h={"300px"}
              borderTopLeftRadius={"3xl"}
              borderTopRightRadius={"3xl"}
            />
            <Text
              width={"full"}
              pr={"10px"}
              fontSize={"2xl"}
              textAlign={"right"}
            >
              {infoEvent.eventName}
            </Text>
            <HStack alignSelf={"flex-end"} pr={"5px"} p={"5px"}>
              <HStack borderRight={"1px"} pr={"10px"} borderColor={"gray"}>
                <Text fontSize={"2xl"} color={"gray"} textAlign={"right"}>
                  {infoEvent.date}
                </Text>
                <CalendarIcon color={"blue"} fontSize={"larger"} />
              </HStack>
              {/* <Divider border={"1px"} /> */}
              <HStack>
                <Text fontSize={"2xl"} color={"gray"} textAlign={"right"}>
                  {infoEvent.placeEvent}
                </Text>
                <i
                  className="fas fa-map-marker-alt"
                  style={{ color: "green", fontSize: "larger" }}
                ></i>
              </HStack>
            </HStack>
          </VStack>
        </Box>
        <Box
          width={"500px"}
          borderColor={"gray"}
          borderRadius={"3xl"}
          m={"5px"}
          display={"flex"}
          justifyContent={"canter"}
          alignItems={"center"}
        >
          <VStack
            border={"1px solid white"}
            w={"70%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"right"}
                color={"white"}
                fontSize={"2xl"}
                className="font"
              >
                {infoTicket.price}
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"right"}
                color={"blue.400"}
                fontSize={"3xl"}
                className="font"
              >
                :السعر
              </Text>
            </HStack>
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"white"}
                fontSize={"2xl"}
                className="font"
              >
                1
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"blue.400"}
                fontSize={"3xl"}
                className="font"
              >
                :عدد التذاكر
              </Text>
            </HStack>
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"white"}
                fontSize={"2xl"}
                className="font"
              >
                {infoTicket.seat}
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"blue.400"}
                fontSize={"3xl"}
                className="font"
              >
                :المقعد
              </Text>
            </HStack>
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"white"}
                fontSize={"2xl"}
                className="font"
              >
                {infoTicket.category}
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"blue.400"}
                fontSize={"3xl"}
                className="font"
              >
                :الفئة
              </Text>
            </HStack>
            <Divider />
            <PayPalButtons
              style={{ color: "blue" }}
              createOrder={(data: any) => createOrder(data)}
              onApprove={(data: any) => onApprove(data)}
              onError={onError}
              fundingSource={FUNDING.PAYPAL}
            />
            {/* </HStack> */}
          </VStack>
        </Box>
      </HStack>
      <HStack
        justifyContent={"space-around"}
        alignContent={"center"}
        w={"100%"}
      >
        {/* <VStack w={"40%"} border={"1px solid white"} p={"10px"}>
          <Heading textAlign={"center"}>تفاصيل الدفع</Heading>
          <Input placeholder="name" />
          <Input placeholder="name" />
          <Input placeholder="name" />
          <Input placeholder="name" />
          <Input placeholder="name" /> */}
        {/* <Button bg={"blue.600"} _hover={{ bg: "blue.800" }}>
            دفع
          </Button> */}
        {/* </VStack> */}
      </HStack>
      <PurchaseConfirm boo={isOpen} onClose={onClose} />
    </Box>
  );
}

export default PayPage;

// <Grid
//             templateColumns="repeat(4, 1fr)"
//             // gap={"10%"}
//             w={"100%"}
//             // alignContent={"space-between"}
//             // alignItems={"self-end"}
//             justifyContent={"space-between"}
//           >
//             <GridItem
//               padding={"5px"}
//               h="10"
//               fontSize={{ base: "smaller", md: "lg" }}
//             >
//               السعر
//             </GridItem>
//             <GridItem
//               h="10"
//               padding={"5px"}
//               fontSize={{ base: "small", md: "lg" }}
//             >
//               عدد التذاكر
//             </GridItem>
//             <GridItem
//               padding={"5px"}
//               h="10"
//               fontSize={{ base: "small", md: "lg" }}
//             >
//               الموقع
//             </GridItem>
//             <GridItem
//               padding={"5px"}
//               h="10"
//               fontSize={{ base: "small", md: "lg" }}
//             >
//               الفئة
//             </GridItem>
//           </Grid>

// const createOrder = async (data: any) => {
//   try {
//     // Order is created on the server and the order id is returned
//     const response = await fetch(
//       "http://localhost:3336/my-server/create-paypal-order",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // use the "body" param to optionally pass additional order information
//         // like product skus and quantities
//         body: JSON.stringify({
//           Ticket: {
//             price: infoTicket.price,
//             category: infoTicket.category,
//           },
//         }),
//       }
//     );
//     const order = await response.json();
//     console.log(order.id);
//     return order.id;
//   } catch (err) {
//     console.log(err);
//   }
// };
// const onApprove = async (data: any) => {
//   // Order is captured on the server and the response is returned to the browser
//   try {
//     const response = await fetch(
//       "http://localhost:3336/my-server/capture-paypal-order",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           orderID: data.orderID,
//         }),
//       }
//     );
//     const or = await response.json();
//     console.log(or);
//     return or;
//   } catch (err) {
//     console.log(err);
//   }
// };
