'''
    contains my previous REST API development work using Django & Flask(Python)
    implements CRUD functions for the work orders CRM
'''
from db import dbc
from bson.objectid import ObjectId
import json


class WorkOrders:
    @staticmethod
    def create(account, data):
        mongo = dbc()
        work_orders = mongo.db.work_orders
        if data['org_id'] in account['orgs']:
            _id = work_orders.insert_one(data)
            return True, ["Work order created successfully",str(_id.inserted_id)]

        return False, "Work order does not have access to the organization"

    @staticmethod
    def update(account, work_order_id, data):
        db = dbc().db
        work_orders = db.work_orders

        work_order = work_orders.find_one({"_id": ObjectId(work_order_id)})
        if work_order['org_id'] in account['orgs']:
            #if the organization is being updated
            try:
                #check if the account has the new organization
                if data['org_id'] in account['orgs']:
                    work_orders.update({"_id": ObjectId(work_order_id)}, {"$set": data})
                    return True,"Success!"
                else:
                    return False, "Account does not have access to the new organization"
            except NameError:
                #no change in the organization 
                work_orders.update({"_id": ObjectId(work_order_id)}, {"$set": data})
                return True,"Success!"
        else:
            return False, "Account does not have access to this work order"

    @staticmethod
    def delete(account, work_order_id):
        db = dbc().db
        work_orders = db.work_orders
        work_order = work_orders.find_one({"_id": ObjectId(work_order_id)})
        if work_order['org_id'] in account['orgs']:
            work_orders.remove({"_id": ObjectId(work_order_id)})
            return True,"Success!"

        return False, "Account does not have access to this work order"

    @staticmethod
    def get(account, work_order_id):
        db = dbc().db
        work_orders = db.work_orders
        work_order = work_orders.find_one({"_id": ObjectId(work_order_id)})
        if work_order['org_id'] in account['orgs']:
            work_order['id'] = str(work_order['_id'])
            del work_order['_id']
            return True,work_order
            
        return False, "Account does not have access to this work order"

    @staticmethod
    def getAll(account):
        db = dbc().db
        work_orders = db.work_orders
        cursor = work_orders.find({})
        allWorkOrders = []
        for work_order in cursor:
            if work_order['org_id'] in account['orgs']:
                work_order['_id'] = str(work_order['_id'])
                allWorkOrders.append(work_order)

        if len(allWorkOrders) == 0:
            return False,"No work orders accessible to this account found"

        return True,allWorkOrders
