import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import "./app.css";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./ContextUser";

function NavBar(props: any) {
  const { userInfo } = UserContext();
  const navigate = useNavigate();
  const [admin, setAdmin] = React.useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
    // window.location.reload();
  };
  // React.useEffect(() => {
  //   axios
  //     .get("https://online-shop-mbej-p9jt.onrender.com/user", {
  //       headers: {
  //         authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     })
  //     .then((res) => {
  //       setAdmin(res.data.isAdmin);
  //     });
  // });

  return (
    <Box
      className="nav"
      // backgroundColor={""}
      shadow={"dark-lg"}
      position={"relative"}
      zIndex={20000000}
    >
      <Flex
        //
        bg={useColorModeValue("blackAlpha.700", "gray.800")}
        color={useColorModeValue("gray.100", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 5 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("black", "gray.100")}
        align={"center"}
        justify={"space-between"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
            _hover={{ background: "pink.300" }}
          />
        </Flex>
        <Flex justifyContent={"center"} marginRight={"50"}>
          <Text
            display={"flex"}
            justifyContent={"center"}
            textAlign={"center"}
            fontFamily={"heading"}
            color={useColorModeValue("gray.100", "white")}
          >
            Logo
          </Text>
        </Flex>

        <Flex
          width={"470px"}
          justify={"space-between"}
          display={{ base: "none", md: "flex" }}
          ml={10}
        >
          <Text className="btn-22">التواصل</Text>
          <Text className="btn-22">من نحن</Text>
          <Link to={`/pageuser/${userInfo.id}`}>
            <Text className="btn-22">صفحتي</Text>
          </Link>
          <Link to={"/"}>
            <Text className="btn-22">الرئيسية</Text>
          </Link>
        </Flex>
        {!localStorage.getItem("token") && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={2}
          >
            <Link to={"/login"}>
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{
                  bg: "pink.300",
                }}
              >
                تسجيل الدخول
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{
                  bg: "pink.300",
                }}
              >
                التسجيل
              </Button>
            </Link>
          </Stack>
        )}
        {localStorage.getItem("token") && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={2}
          >
            <Link to={"/login"}>
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{
                  bg: "pink.300",
                }}
                onClick={logout}
              >
                خروج
              </Button>
            </Link>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          bg={useColorModeValue("white", "gray.800")}
          p={0}
          display={{ md: "none" }}
        >
          <Flex
            py={0}
            flexDirection={"column"}
            justify={"space-between"}
            align={"center"}
            _hover={{
              textDecoration: "none",
            }}
          ></Flex>
          <Link to={"/"}>
            <Text
              cursor={"pointer"}
              p={1.5}
              fontWeight={"medium"}
              _hover={{ backgroundColor: "gray.200" }}
            >
              Home
            </Text>
          </Link>
          <hr></hr>
          <Link to={"/orders"}>
            <Text
              cursor={"pointer"}
              p={1.5}
              fontWeight={"medium"}
              _hover={{ backgroundColor: "gray.200" }}
            >
              Orders
            </Text>
          </Link>
          <hr></hr>
          <Link to={"/card"}>
            <Text
              cursor={"pointer"}
              p={1.5}
              fontWeight={"medium"}
              _hover={{ backgroundColor: "gray.200" }}
            >
              Card
            </Text>
          </Link>
          <hr></hr>
          <Text
            cursor={"pointer"}
            p={1.5}
            fontWeight={"medium"}
            _hover={{ backgroundColor: "gray.200" }}
          >
            About Us
          </Text>
          <hr></hr>
          <Text
            cursor={"pointer"}
            p={1.5}
            fontWeight={"medium"}
            _hover={{ backgroundColor: "gray.200" }}
          >
            Contact
          </Text>
          <hr></hr>
        </Stack>
      </Collapse>
    </Box>
  );
}

export default React.memo(NavBar);
