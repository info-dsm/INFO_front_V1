import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../../export/base";
import { Notice } from "../../common/notice";
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2Njg1NTUwMDgsImV4cCI6MTY2ODY0MTQwOH0.DjQe-bca6O9JA7__pyIsLBxDaiiqzRR885ZlWERGvc0";
export const getBoardList = async (id) => {
  const { data } = await axios({
    method: "get",
    url: BaseUrl + "/notice",
    params: { id: id },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return data;
};
export const getNoticeItem = (id) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(["noticeItem", id], () => getBoardList(id));
};
export const noticeRequest = async (method, path, query, message) => {
  await axios({
    method: method,
    url: BaseUrl + path,
    params: { noticeId: query },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      Notice({ state: "seccess", message: message });
    })
    .catch((err) => {
      Notice({ state: "error", message: err.message });
    });
};
export const postNoticeRequest = async (idx, path) => {
  let res;
  await axios({
    method: "get",
    url: BaseUrl + path,
    params: {
      idx: idx,
      size: 7,
    },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  }).then((response) => {
    const data = response.data;
    console.log(data);
    let arr = new Array(data.content.length)
      .fill(0)
      .map((e, i) =>
        new Array(data.content[i].recruitmentBusinessResponse.length).fill("")
      );
    let arr2 = new Array(data.content.length)
      .fill(0)
      .map((e, i) =>
        new Array(data.content[i].recruitmentBusinessResponse.length).fill("")
      );
    let count = [];
    for (let i = 0; i < data.content.length; i++) {
      let temp = 0;
      for (
        let j = 0;
        j < data.content[i].recruitmentBusinessResponse.length;
        j++
      ) {
        arr[i][j] =
          data.content[i].recruitmentBusinessResponse[
            j
          ].classificationResponse.bigClassification.bigClassificationName;
        arr2[i][j] =
          data.content[i].recruitmentBusinessResponse[
            j
          ].classificationResponse.name;
        temp =
          temp +
          data.content[i].recruitmentBusinessResponse[j].numberOfEmployee;
      }
      count.push({
        total: temp,
        name: data.content[i].company.companyName,
        id: data.content[i].noticeId,
      });
    }
    const ad = arr.map((item) =>
      item.filter((e, i, ar) => {
        return ar.findIndex((el) => e === el) === i;
      })
    );
    const as = arr2.map((item) =>
      item.filter((e, i, ar) => {
        return ar.findIndex((el) => e === el) === i;
      })
    );
    for (let i = 0; i < data.content.length; i++) {
      as[i] = as[i].join();
      ad[i] = ad[i].join();
    }
    res = {
      count,
      as,
      ad,
      last: data.last,
      first: data.first,
      totalPage: data.totalPages,
      content: data.content,
    };
  });
  return res;
};
export const postNotice = (idx, path) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(
    ["pagin", idx, path],
    async () => postNoticeRequest(idx, path),
    {
      keepPreviousData: true,
    }
  );
};
export const getCompanyRequest = async (idx) => {
  let data;
  await axios({
    method: "get",
    url: BaseUrl + "/company/list",
    params: {
      idx: idx,
      size: 8,
    },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  }).then((res) => {
    data = res.data;
  });
  console.log(data);
  return data;
};
export const getCompany = (idx) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(["list", idx], async () => getCompanyRequest(idx), {
    keepPreviousData: true,
  });
};
export const getCompanyName = (id) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(["list", id], async () => {
    const { data } = await axios({
      method: "get",
      url: BaseUrl + "/company/search",
      params: { query: id },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
    return data;
  });
};
export const getCompanyInfo = async (id) => {
  const { data } = await axios({
    url: BaseUrl + "/company",
    method: "get",
    params: { id: id },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return data;
};
export const getUseCompanyInfo = (id) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(["companyInfo", id], () => getCompanyInfo(id));
};
export const getUserCompany = async (id, idx) => {
  const { data } = await axios({
    url: BaseUrl + "/hire/apply/" + id,
    method: "get",
    params: {
      idx: idx,
      size: 5,
    },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  console.log(data);
  return data;
};
export const getUseUserCompany = (id, idx) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(["teacherGetUser", id, idx], () =>
    getUseUserCompany(id, idx)
  );
};
